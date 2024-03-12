import passport from "passport";
import { HttpResponse } from "../response/http.response";
import { NextFunction, Request, Response } from "express";
import { ErrorHandlerMiddleware } from "./error.hanlder.middlware";
import { RoleType } from "../../enums/role.type";
import { UserTokenResponseDto } from "../../dto/response/user.token.response.dto";
import { ErrorException } from "../../exceptions/ErrorException";
import { TokenRepository } from "../../repositories/token.repository";

const tokenRepository: TokenRepository = new TokenRepository();

export class SharedMiddleware extends ErrorHandlerMiddleware {


    constructor(public httpResponse: HttpResponse = new HttpResponse()) {
        super();
    }

    passAuth(type: string, req: Request, res: Response, next: NextFunction) {
        return passport.authenticate(type, { session: false }, async function (err: any, user: any, info: any) {
            try {
                if (err) return next(err);
                if (info?.message?.includes('jwt expired')) {
                    const authorizationHeader = req.headers.authorization;

                    if (authorizationHeader) {
                        const tokenJwt = authorizationHeader.replace('Bearer', '').trim();

                        const token = await tokenRepository.findByTokenJwt(tokenJwt);
                        if (!token) throw new ErrorException("El token ha expirado", 403);

                        // funcion para el caso si quiero eliminar el token expirado
                        // tokenRepository.deleteTokenById(token.id)

                        // para el caso que solo lo cambie a revoked true ya que esta expirado
                        token.revoked = true;
                        (await tokenRepository.execRepository).save(token);

                        throw new ErrorException("El token ha expirado", 403);
                    }
                }

                if (info?.message?.includes('Las credenciales son incorrectas')) {
                    throw new ErrorException(`${info.message}`, 401);
                }

                if (info?.message?.includes('El token ha sido revocado')) {
                    throw new ErrorException(`${info.message}`, 403);
                }


                if (!user) return res.status(403).json({ message: info.message });

                req.user = user; // Asigna el usuario autenticado a req.user para que esté disponible en el siguiente middleware
                return next();

            } catch (err) {
                next(err);
            }

        })(req, res, next);;

    }


    checkSocioRole(req: Request, res: Response, next: NextFunction) {
        console.log("Check socio role")
        const user = req.user as UserTokenResponseDto;
        if (user.rol !== RoleType.SOCIO.toString()) {
            throw new ErrorException("No tienes permisos de acceso", 403);
        }
        return next();
    }

    checkAdminRole(req: Request, res: Response, next: NextFunction) {
        console.log("Check admin role")
        const user = req.user as UserTokenResponseDto;
        if (user.rol !== RoleType.ADMIN.toString()) {
            throw new ErrorException("No tienes permisos de acceso", 403);
        }
        return next();

    }
}
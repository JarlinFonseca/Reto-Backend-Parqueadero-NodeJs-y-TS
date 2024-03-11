import passport, { authenticate } from "passport";
import { HttpResponse } from "../response/http.response";
import { NextFunction, Request, Response } from "express";
import { ErrorHandlerMiddleware } from "./error.hanlder.middlware";
import { RoleType } from "../../enums/role.type";
import { UserEntity } from "../../entities/user.entity";
import { UserTokenResponseDto } from "../../dto/response/user.token.response.dto";
import { TokenExpiredError } from "jsonwebtoken";
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
                //  console.log(info.message)
                if (info && info.message && info.message.includes('jwt expired')) {
                    const authorizationHeader = req.headers.authorization;
                    console.log(authorizationHeader !== null)
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

                if (info && info.message && info.message.includes('Las credenciales son incorrectas')) {
                    throw new ErrorException(`${info.message}`, 401);
                }

                if (info && info.message && info.message.includes('El token ha sido revocado')) {
                    throw new ErrorException(`${info.message}`, 403);
                }


                if (!user) return res.status(403).json({ message: info.message });

                req.user = user; // Asigna el usuario autenticado a req.user para que esté disponible en el siguiente middleware
                console.log("Entra en el SharedMiddleware en la funcion dentro del passAuth")
                return next();

            } catch (err) {
                next(err);
            }



        })(req, res, next);;

    }

    // passAuth(type: string, req: Request, res: Response, next: NextFunction) {
    //     return passport.authenticate(type, { session: false }, function (err: any, user: any, info: any) {
    //         if (err) return next(err);
    //         if (!user) return res.status(401).json({ message: info.message });

    //         req.user = user; // Asigna el usuario autenticado a req.user para que esté disponible en el siguiente middleware
    //         //  console.log(user)
    //         console.log("Entra en el SharedMiddleware en la funcion dentro del passAuth")
    //         return next();
    //     })(req, res, next);;

    // }

    checkSocioRole(req: Request, res: Response, next: NextFunction) {
        const user = req.user as UserTokenResponseDto;
        if (user.rol !== RoleType.SOCIO.toString()) {
            throw new ErrorException("No tienes permisos de acceso", 403 );
           // return this.httpResponse.Forbidden(res, "No tienes permiso");
        }
        return next();
    }

    checkAdminRole(req: Request, res: Response, next: NextFunction) {
        console.log("Check admin role")
        const user = req.user as UserTokenResponseDto;
        if (user.rol !== RoleType.ADMIN.toString()) {
            throw new ErrorException("No tienes permisos de acceso", 403 );
          //  return this.httpResponse.Forbidden(res, "No tienes permiso");
        }
        return next();

    }
}
import passport from "passport";
import { HttpResponse } from "../response/http.response";
import { NextFunction, Request, Response } from "express";
import { ErrorHandlerMiddleware } from "./error.hanlder.middlware";
import { RoleType } from "../../enums/role.type";
import { UserEntity } from "../../entities/user.entity";
import { UserTokenResponseDto } from "../../dto/response/user.token.response.dto";

export class SharedMiddleware extends ErrorHandlerMiddleware {
    constructor(public httpResponse: HttpResponse = new HttpResponse()) {
        super();
    }

    passAuth(type: string, req: Request, res: Response, next: NextFunction) {
        return passport.authenticate(type, { session: false }, function (err: any, user: any, info: any) {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info.message });

            req.user = user; // Asigna el usuario autenticado a req.user para que esté disponible en el siguiente middleware
            //  console.log(user)
            console.log("Entra en el SharedMiddleware en la funcion dentro del passAuth")
            return next();
        })(req, res, next);;

    }

    checkSocioRole(req: Request, res: Response, next: NextFunction) {
        const user = req.user as UserTokenResponseDto;
        if (user.rol !== RoleType.SOCIO.toString()) {
            return this.httpResponse.Unauthorized(res, "No tienes permiso");
        }
        return next();
    }

    checkAdminRole(req: Request, res: Response, next: NextFunction) {
        console.log("Check admin role")
        const user = req.user as UserTokenResponseDto;
        if (user.rol !== RoleType.ADMIN.toString()) {
            return this.httpResponse.Unauthorized(res, "No tienes permiso");
        }
        return next();

    }
}
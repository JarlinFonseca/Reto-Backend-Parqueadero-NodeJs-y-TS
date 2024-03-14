import { NextFunction, Request, Response } from "express";
import { UserRequestDTO } from "../dto/request/user.request.dto";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { ValidateUtils } from "../shared/util/validate.utils";


export class UserMiddleware extends SharedMiddleware {

    private validateUtils: ValidateUtils = new ValidateUtils();

    userValidator(req: Request, res: Response, next: NextFunction) {
        const { name, lastname, dni, email, password, } =
            req.body;

        const valid = new UserRequestDTO();

        valid.name = name;
        valid.lastname = lastname;
        valid.dni = dni;
        valid.email = email;
        valid.password = password;

        this.validateUtils.validateFields(valid, res, next);

    }
}
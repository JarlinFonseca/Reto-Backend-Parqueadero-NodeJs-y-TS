import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { MessageRequestDto } from "../dtos/request/message.request.dto";
import { ValidateUtils } from "../shared/util/validate.utils";

export class MessageMiddleware {

    private validateUtils = new ValidateUtils();

    messageValidator(req: Request, res: Response, next: NextFunction, schema: Joi.ObjectSchema) {
        const { email, placa, description, parkingLotName } =
            req.body;

        const valid = new MessageRequestDto();

        valid.email = email;
        valid.placa = placa;
        valid.description = description;
        valid.parkingLotName = parkingLotName;


        this.validateUtils.validateFields(schema, valid, res, next);

    }

}
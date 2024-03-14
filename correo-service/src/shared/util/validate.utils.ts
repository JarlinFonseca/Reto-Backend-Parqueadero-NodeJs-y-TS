import { NextFunction, Response } from "express";
import Joi, { ValidationResult } from "joi";

export class ValidateUtils {

    async validateFields(schema: Joi.ObjectSchema, valid: any, res: Response, next: NextFunction) {

        const { error }: ValidationResult = schema.validate(valid, {
            abortEarly: false
        });

        if (error) {
            const allErrors: any = {};
            error.details.forEach((validationError: any) => {
                const propertyName = validationError.path.join('_');
                const message = validationError.message;
                allErrors[propertyName] = message;
            });

            console.error(allErrors);
            return res.status(400).json(allErrors);
        }

        next();


    }

}
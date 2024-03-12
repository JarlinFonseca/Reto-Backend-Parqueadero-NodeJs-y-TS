import { validate } from "class-validator";
import { NextFunction, Response } from "express";

export class ValidateUtils{

     validateFields(valid:any, res: Response, next: NextFunction ){

        validate(valid).then((err) => {
            if (err.length > 0) {
                const allErrors: any = {};

                err.forEach((validationError) => {
                    const constraints = validationError.constraints;
                    const propertyName = validationError.property;

                    if (constraints) {

                        const constraintMessages: string[] = [];

                        for (const key in constraints) {
                            if (Object.hasOwn(constraints, key)) {
                                constraintMessages.push(constraints[key]);
                            }
                        }

                        allErrors[propertyName] = constraintMessages;

                         //version 2:  allErrors[propertyName] =constraints[Object.keys(constraints)[0]

                        // Version 3
                        // let counter = 1;
                        // for (const key in constraints) {
                        //     if (Object.prototype.hasOwnProperty.call(constraints, key)) {
                        //         const constraintKey = `${propertyName}_${counter}`;
                        //         //const constraintKey = `${propertyName}_${key}`;
                        //         allErrors[constraintKey] = constraints[key];
                        //         counter++;
                        //     }
                        // }

                    }
                });

                console.log(allErrors);
                return res.status(409).json(allErrors);

            } else {
                next();
            }
        })

    }



}
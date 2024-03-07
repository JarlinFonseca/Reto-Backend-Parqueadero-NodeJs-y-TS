import { NextFunction, Request, Response } from "express";
import { UserRequestDTO } from "../dto/request/user.request.dto";
import { validate } from "class-validator";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";


export class UserMiddleware extends SharedMiddleware {

    constructor() {
        super();
    }

    userValidator(req: Request, res: Response, next: NextFunction) {
        const { name, lastname, dni, email, password, } =
            req.body;

        const valid = new UserRequestDTO();

        valid.name = name;
        valid.lastname = lastname;
        valid.dni = dni;
        valid.email = email;
        valid.password = password;


        validate(valid).then((err) => {
            if (err.length > 0) {
                //  const allConstraints = err.map((validationError) => validationError.constraints);

                //  console.log(allConstraints);
                //  return res.status(409).json({ constraints: allConstraints });
                const allErrors: any = {};

                err.forEach((validationError) => {
                    const constraints = validationError.constraints;
                    const propertyName = validationError.property;

                    if (constraints) {
                     //version 1:  allErrors[propertyName] =constraints[Object.keys(constraints)[0
                     
                      const constraintMessages: string[] = [];

                        for (const key in constraints) {
                            if (Object.prototype.hasOwnProperty.call(constraints, key)) {
                                constraintMessages.push(constraints[key]);
                            }
                        }

                        allErrors[propertyName] = constraintMessages;

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

    private translateConstraint(propertyName: string, constraints: Record<string, string>): string {
        switch (Object.keys(constraints)[0]) {
            case "isNotEmpty":
                return `El campo ${propertyName} no debe estar vacío`;
            // Agrega aquí tus traducciones para otras validaciones si es necesario
            default:
                return constraints[Object.keys(constraints)[0]];
        }
    }
}
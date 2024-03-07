import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { ParkingLotRequestDto } from "../dto/request/parking.lot.request.dto";

export class ParkingLotMiddleware extends SharedMiddleware {

    constructor() {
        super();
    }

    parkingLotValidator(req: Request, res: Response, next: NextFunction) {
        const { name, quantityVehiclesMaximum, costHourVehicle, partnerId } =
            req.body;

        const valid = new ParkingLotRequestDto();

        valid.name = name;
        valid.quantityVehiclesMaximum= quantityVehiclesMaximum;
        valid.costHourVehicle = costHourVehicle;
        valid.partnerId = partnerId;



        validate(valid).then((err) => {
            if (err.length > 0) {
                const allErrors: any = {};

                err.forEach((validationError) => {
                    const constraints = validationError.constraints;
                    const propertyName = validationError.property;

                    if (constraints) {

                        const constraintMessages: string[] = [];

                        for (const key in constraints) {
                            if (Object.prototype.hasOwnProperty.call(constraints, key)) {
                                constraintMessages.push(constraints[key]);
                            }
                        }

                        allErrors[propertyName] = constraintMessages;


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
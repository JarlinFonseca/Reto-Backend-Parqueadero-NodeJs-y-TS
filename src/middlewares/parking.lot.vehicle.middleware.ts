import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { ParkingLotRequestDto } from "../dto/request/parking.lot.request.dto";
import { EntryVehicleParkingLotRequestDto } from "../dto/request/entry.vehicle.parking.lot.request.dto";

export class ParkingLotVehicleMiddleware extends SharedMiddleware {

    constructor() {
        super();
    }

    parkingLotVehicleValidator(req: Request, res: Response, next: NextFunction) {
        const { placa, parkingLotId } =
            req.body;

        const valid = new EntryVehicleParkingLotRequestDto();

        valid.placa = placa;
        valid.parkingLotId = parkingLotId



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
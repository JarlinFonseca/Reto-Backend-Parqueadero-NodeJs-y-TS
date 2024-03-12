import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { ParkingLotRequestDto } from "../dto/request/parking.lot.request.dto";
import { ValidateUtils } from "../shared/util/validate.utils";

export class ParkingLotMiddleware extends SharedMiddleware {

    private validateUtils: ValidateUtils = new ValidateUtils();


    parkingLotValidator(req: Request, res: Response, next: NextFunction) {
        const { name, quantityVehiclesMaximum, costHourVehicle, partnerId } =
            req.body;

        const valid = new ParkingLotRequestDto();

        valid.name = name;
        valid.quantityVehiclesMaximum = quantityVehiclesMaximum;
        valid.costHourVehicle = costHourVehicle;
        valid.partnerId = partnerId;

        this.validateUtils.validateFields(valid, res, next);

    }
}
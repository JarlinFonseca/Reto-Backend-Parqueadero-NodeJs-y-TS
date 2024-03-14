import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { EntryVehicleParkingLotRequestDto } from "../dto/request/entry.vehicle.parking.lot.request.dto";
import { ExitVehicleParkingLotRequestDto } from "../dto/request/exit.vehicle.parking.lot.request.dto";
import { ValidateUtils } from "../shared/util/validate.utils";

export class ParkingLotVehicleMiddleware extends SharedMiddleware {

    private validateUtils: ValidateUtils = new ValidateUtils();

    parkingLotVehicleEntryValidator(req: Request, res: Response, next: NextFunction) {
        const { placa, parkingLotId } =
            req.body;

        const valid = new EntryVehicleParkingLotRequestDto();

        valid.placa = placa;
        valid.parkingLotId = parkingLotId

        this.validateUtils.validateFields(valid, res, next);

    }

    parkingLotVehicleExitValidator(req: Request, res: Response, next: NextFunction) {
        const { placa, parkingLotId } =
            req.body;

        const valid = new ExitVehicleParkingLotRequestDto();

        valid.placa = placa;
        valid.parkingLotId = parkingLotId

        this.validateUtils.validateFields(valid, res, next);

    }

}
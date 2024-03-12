import { NextFunction, Request, Response } from "express";
import { ParkingLotVehicleService } from "../services/parking.lot.vehicle.service";
import { HttpResponse } from "../shared/response/http.response";
import { ErrorException } from "../exceptions/ErrorException";

export class IndicatorController {
    constructor(
        private readonly parkingLotVehicleService: ParkingLotVehicleService = new ParkingLotVehicleService(),
        private readonly httpResponse: HttpResponse = new HttpResponse()
    ) { }


    getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTen(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenJwt = req.headers.authorization?.replace('Bearer', '').trim();
            if (!tokenJwt) {
                throw new ErrorException("Token JWT no proporcionado", 409);
            }

            this.parkingLotVehicleService.getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTen(tokenJwt)
                .then((data) => { return this.httpResponse.Ok(res, data) })
                .catch((err) => next(err));
        } catch (err) {
            next(err);
        }

    }




}
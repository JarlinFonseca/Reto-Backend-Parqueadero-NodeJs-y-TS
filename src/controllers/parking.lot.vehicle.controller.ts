import { NextFunction, Request, Response } from "express";
import { ParkingLotVehicleService } from "../services/parking.lot.vehicle.service";
import { HttpResponse } from "../shared/response/http.response";
import { ErrorException } from "../exceptions/ErrorException";

export class ParkingLotVehicleController{

    constructor(
        private readonly parkingLotVehicleService: ParkingLotVehicleService = new ParkingLotVehicleService(), 
        private readonly httpResponse: HttpResponse = new HttpResponse()
        ) {}


        async registerVehicleEntry(req: Request, res: Response, next: NextFunction){
            try {
                const tokenJwt = req.headers.authorization?.replace('Bearer', '').trim();
                if (!tokenJwt) {
                  throw new ErrorException("Token JWT no proporcionado", 409);
                }
          
                const data = await this.parkingLotVehicleService.registerVehicleEntry(req.body, tokenJwt);
                return this.httpResponse.Created(res, data);
              } catch (err) {
                next(err);
              }
        }

        async registerVehicleExit(req: Request, res: Response, next: NextFunction){
            try {
                const tokenJwt = req.headers.authorization?.replace('Bearer', '').trim();
                if (!tokenJwt) {
                  throw new ErrorException("Token JWT no proporcionado", 409);
                }
          
                const data = await this.parkingLotVehicleService.registerVehicleExit(req.body, tokenJwt);
                return this.httpResponse.Created(res, data);
              } catch (err) {
                next(err);
              }
        }

    


}
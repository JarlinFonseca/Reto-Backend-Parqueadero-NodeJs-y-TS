﻿import { NextFunction, Request, Response } from "express";

import { HttpResponse } from "../shared/response/http.response";
import { ParkingLotService } from "../services/parking.lot.service";

export class ParkingLotController{

    constructor(
        private readonly parkingLotService: ParkingLotService = new ParkingLotService(), 
        private readonly httpResponse: HttpResponse = new HttpResponse()
        ) {}


    
  async saveParkingLot(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.parkingLotService.saveParkingLot(req.body);
      return this.httpResponse.Created(res, data);
    } catch (err) {
      next(err);
    }
  }
 


}
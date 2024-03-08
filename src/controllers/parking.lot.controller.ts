import { NextFunction, Request, Response } from "express";

import { HttpResponse } from "../shared/response/http.response";
import { ParkingLotService } from "../services/parking.lot.service";
import { UpdateResult } from "typeorm";

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

  async getParkingLots(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.parkingLotService.findAllParkingLots();
      return this.httpResponse.Ok(res, data)
    } catch (e) {
      next(e);
    }
  }

  async getParkingLotById(req: Request, res: Response, next: NextFunction){
    try{
      const { id } = req.params;
      const data = await this.parkingLotService.findParkingLotById(Number(id));
      return this.httpResponse.Ok(res, data);
    }catch(e){
      next(e);
    }
  }

    async updateParkingLot(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const data = await this.parkingLotService.updateParkingLot(Number(id), req.body);
      return this.httpResponse.Ok(res, data)
    } catch (e) {
      next(e)};
    }

    
  async deleteParkingLot(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const data = await this.parkingLotService.deleteParkingLot(Number(id));
      return this.httpResponse.NoContent(res);
    } catch (e) {
      next(e);
    }
  }
  }

  
 



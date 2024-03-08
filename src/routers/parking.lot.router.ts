﻿import { ParkingLotController } from "../controllers/parking.lot.controller";
import { ParkingLotMiddleware } from "../middlewares/parking.lot.middleware";
import { BaseRouter } from "../shared/router/router";

export class ParkingLotRouter extends BaseRouter<ParkingLotController,ParkingLotMiddleware >{
    constructor() {
        super(ParkingLotController, ParkingLotMiddleware);
      }

      routes(): void{
        this.router.post(
            "/parqueaderos",
            (req, res, next) => [this.middleware.parkingLotValidator(req, res, next)],
            (req, res, next) => this.controller.saveParkingLot(req, res, next)
          );



      }



}
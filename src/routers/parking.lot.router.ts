import { ParkingLotController } from "../controllers/parking.lot.controller";
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

          this.router.get(
            "/parqueaderos",
            (req, res, next) => this.controller.getParkingLots(req, res, next)
          );

          this.router.get(
            "/parqueaderos/:id",
            (req, res, next) => this.controller.getParkingLotById(req, res, next)
          );

          this.router.put(
            "/parqueaderos/:id",
            (req, res, next) => [this.middleware.parkingLotValidator(req, res, next)],
            (req, res, next) => this.controller.updateParkingLot(req, res, next)
          );

          this.router.delete(
            "/parqueaderos/:id",
            (req, res, next) => this.controller.deleteParkingLot(req, res, next)
          );

      }



}
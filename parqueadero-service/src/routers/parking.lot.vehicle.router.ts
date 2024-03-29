﻿import { ParkingLotVehicleController } from "../controllers/parking.lot.vehicle.controller";
import { RoleType } from "../enums/role.type";
import { ParkingLotVehicleMiddleware } from "../middlewares/parking.lot.vehicle.middleware";
import { BaseRouter } from "../shared/router/router";

export class ParkingLotVehicleRouter extends BaseRouter<ParkingLotVehicleController,ParkingLotVehicleMiddleware >{
    constructor() {
        super(ParkingLotVehicleController, ParkingLotVehicleMiddleware);
      }

      routes(): void{
        this.router.post(
            "/parqueaderos/vehiculos/ingresos",
            (req, res, next) => this.middleware.passAuth("jwt", req, res, next),
            (req, res, next) => this.middleware.checkSocioRole(req, res, next),
            (req, res, next) => this.middleware.parkingLotVehicleEntryValidator(req, res, next),
            (req, res, next) => this.controller.registerVehicleEntry(req, res, next)
          );

          this.router.post(
            "/parqueaderos/vehiculos/salidas",
            (req, res, next) => this.middleware.passAuth("jwt", req, res, next),
            (req, res, next) => this.middleware.checkSocioRole(req, res, next),
            (req, res, next) => this.middleware.parkingLotVehicleExitValidator(req, res, next),
            (req, res, next) => this.controller.registerVehicleExit(req, res, next)
          );

          this.router.get(
            "/parqueaderos/:id/vehiculos",
            (req, res, next) => this.middleware.passAuth("jwt", req, res, next),
            this.middleware.checkRoles([RoleType.SOCIO, RoleType.ADMIN]),
            (req, res, next) => this.controller.getVehiclesParkedByParkingLotId(req, res, next)
          )


      }



}
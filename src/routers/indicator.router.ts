import { IndicatorController } from "../controllers/indicator.controller";
import { RoleType } from "../enums/role.type";
import { IndicatorMiddleware } from "../middlewares/indicator.middleware";
import { BaseRouter } from "../shared/router/router";

export class IndicatorRouter extends BaseRouter<IndicatorController, IndicatorMiddleware>{
    constructor(){
        super(IndicatorController, IndicatorMiddleware)
    }

    routes(): void{
        this.router.get(
            "/indicadores/parqueaderos/vehiculos/mas-veces-registrados",
            (req, res, next) => this.middleware.passAuth("jwt", req, res, next),
            this.middleware.checkRoles([RoleType.SOCIO, RoleType.ADMIN]),
            (req, res, next) => this.controller.getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTen(req, res, next)
          );

          this.router.get(
            "/indicadores/parqueaderos/:id/vehiculos/mas-veces-registrados",
            (req, res, next) => this.middleware.passAuth("jwt", req, res, next),
             this.middleware.checkRoles([RoleType.SOCIO, RoleType.ADMIN]),
            (req, res, next) => this.controller.getVehiclesMoreTimesRegisteredByParkingLotId(req, res, next)
          );

          this.router.get(
            "/indicadores/parqueaderos/:id/primera-vez",
            (req, res, next) => this.middleware.passAuth("jwt", req, res, next),
             this.middleware.checkRoles([RoleType.SOCIO, RoleType.ADMIN]),
            (req, res, next) => this.controller.getVehiclesParkedForFirstTimeByParkingLotId(req, res, next)
          );


    }



}
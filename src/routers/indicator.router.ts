import { IndicatorController } from "../controllers/indicator.controller";
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
           // (req, res, next) => this.middleware.checkAdminRole(req, res, next),
            (req, res, next) => this.controller.getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTen(req, res, next)
          );


    }



}
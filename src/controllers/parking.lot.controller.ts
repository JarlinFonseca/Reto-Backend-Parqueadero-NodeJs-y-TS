import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../shared/response/http.response";
import { ParkingLotService } from "../services/parking.lot.service";
import { ErrorException } from "../exceptions/ErrorException";

export class ParkingLotController {

  constructor(
    private readonly parkingLotService: ParkingLotService = new ParkingLotService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) { }


  saveParkingLot(req: Request, res: Response, next: NextFunction) {
    this.parkingLotService.saveParkingLot(req.body)
      .then((data) => { return this.httpResponse.Created(res, data); })
      .catch((err) => next(err));
  }

  getParkingLots(req: Request, res: Response, next: NextFunction) {
    this.parkingLotService.findAllParkingLots()
      .then((data) => { return this.httpResponse.Ok(res, data) })
      .catch((err) => next(err));
  }

  getParkingLotById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    this.parkingLotService.findParkingLotById(Number(id))
      .then((data) => { return this.httpResponse.Ok(res, data); })
      .catch((err) => next(err));
  }

  updateParkingLot(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    this.parkingLotService.updateParkingLot(Number(id), req.body)
      .then((data) => { return this.httpResponse.Ok(res, data) })
      .catch((err) => next(err));
  }


  deleteParkingLot(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    this.parkingLotService.deleteParkingLot(Number(id))
      .then(() => { return this.httpResponse.NoContent(res); })
      .catch((err) => next(err));
  }

  getParkingLotsPartner(req: Request, res: Response, next: NextFunction){
    try {
      const tokenJwt = req.headers.authorization?.replace('Bearer', '').trim();
      if (!tokenJwt) {
        throw new ErrorException("Token JWT no proporcionado", 409);
      }
      this.parkingLotService.getParkingLotsPartner(tokenJwt)
      .then((data) => { return this.httpResponse.Ok(res, data)})
      .catch((err) => next(err));
    } catch (err) {
      next(err);
    }


      
  }
}






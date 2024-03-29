﻿import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { ConfigServer } from "./config/config";
import { DataSource } from "typeorm";
import { UserRouter } from "./routers/user.router";
import { ErrorHandlerMiddleware } from "./shared/middlewares/error.hanlder.middlware";
import { ParkingLotRouter } from "./routers/parking.lot.router";
import { LoginStrategy } from "./auth/strategies/login.strategy";
import { JwtStrategy } from "./auth/strategies/jwt.strategy";
import { AuthRouter } from "./auth/auth.router";
import { ParkingLotVehicleRouter } from "./routers/parking.lot.vehicle.router";
import { IndicatorRouter } from "./routers/indicator.router";



class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");

  constructor() {
    super();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.passportUse();

    this.dbConecct();

    this.app.use(morgan("dev"));
    this.app.use(cors());

    this.app.use("/api/v1", this.routers());
    this.app.use(new ErrorHandlerMiddleware().errorHandler)

    this.listen();
  }

  routers(): Array<express.Router> {
    return [
      new UserRouter().router,
      new ParkingLotRouter().router,
      new AuthRouter().router,
      new ParkingLotVehicleRouter().router,
      new IndicatorRouter().router

    ];
  }

  passportUse() {
    return [new LoginStrategy().use, new JwtStrategy().use]
  }

  async dbConecct(): Promise<DataSource | void> {
    return this.initConnect.then(() => {
      console.log("Connect Success")
    }).catch((err) => {
      console.error(err)
    })
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log("Server listening on port =>" + this.port);
    });
  }
}

const serverBootstrap = new ServerBootstrap(); 

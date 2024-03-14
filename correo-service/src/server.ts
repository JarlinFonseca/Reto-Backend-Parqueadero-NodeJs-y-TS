import express from "express";
import morgan from "morgan";
import cors from "cors";
import { ConfigServer } from "./config/config";
import mongoose from "mongoose";
import { ErrorHandlerMiddleware } from "./shared/middlewares/error.hanlder.middlware";
import { MessageRouter } from "./routers/message.router";


class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");

  constructor() {
    super();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.connectToMongoDB();

    this.app.use(morgan("dev"));
    this.app.use(cors());

    this.app.use("/api/v1", this.routers());
    this.app.use(new ErrorHandlerMiddleware().errorHandler)

    this.listen();
  }

  routers(): Array<express.Router> {
    return [
        new MessageRouter().router,
    ];
  }
  

  public async connectToMongoDB(): Promise<void> {
    const mongoDBUri = this.getMongoDBUri();
    try {
      await mongoose.connect(mongoDBUri);
      console.log("Conexión exitosa a MongoDB");
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
      throw error;
    }
  }


  public listen() {
    this.app.listen(this.port, () => {
      console.log("Server listening on port =>" + this.port);
    });
  }
}

const serverBootstrap = new ServerBootstrap(); 

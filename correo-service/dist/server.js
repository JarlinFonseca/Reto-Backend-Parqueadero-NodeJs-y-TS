"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const error_hanlder_middlware_1 = require("./shared/middlewares/error.hanlder.middlware");
const message_router_1 = require("./routers/message.router");
class ServerBootstrap extends config_1.ConfigServer {
    app = (0, express_1.default)();
    port = this.getNumberEnv("PORT");
    constructor() {
        super();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.connectToMongoDB();
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)());
        this.app.use("/api/v1", this.routers());
        this.app.use(new error_hanlder_middlware_1.ErrorHandlerMiddleware().errorHandler);
        this.listen();
    }
    routers() {
        return [
            new message_router_1.MessageRouter().router,
        ];
    }
    async connectToMongoDB() {
        const mongoDBUri = this.getMongoDBUri();
        try {
            await mongoose_1.default.connect(mongoDBUri);
            console.log("Conexión exitosa a MongoDB");
        }
        catch (error) {
            console.error("Error al conectar a MongoDB:", error);
            throw error;
        }
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Server listening on port =>" + this.port);
        });
    }
}
const serverBootstrap = new ServerBootstrap();

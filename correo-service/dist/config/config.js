"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigServer = void 0;
const dotenv = __importStar(require("dotenv"));
class ConfigServer {
    constructor() {
        const nodeNameEnv = this.createPathEnv(this.nodeEnv);
        dotenv.config({
            path: nodeNameEnv,
        });
    }
    getEnvironment(k) {
        return process.env[k];
    }
    getNumberEnv(k) {
        return Number(this.getEnvironment(k));
    }
    get nodeEnv() {
        return this.getEnvironment("NODE_ENV")?.trim() ?? "";
    }
    createPathEnv(path) {
        const arrEnv = ["env"]; //['hola', 'mundo'] => 'hola.mundo'
        if (path.length > 0) {
            const stringToArray = path.split(".");
            arrEnv.unshift(...stringToArray);
        }
        return "." + arrEnv.join(".");
    }
    getMongoDBUri() {
        const mongoDBUri = this.getEnvironment("MONGODB_URI");
        if (!mongoDBUri) {
            throw new Error("Variable de entorno MONGODB_URI no definida");
        }
        return mongoDBUri;
    }
}
exports.ConfigServer = ConfigServer;

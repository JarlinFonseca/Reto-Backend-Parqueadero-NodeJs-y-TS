"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FechaUtils = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class FechaUtils {
    convertirFechaUtcAColombia(fechaUtc) {
        const fechaColombia = moment_timezone_1.default.utc(fechaUtc).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
        return fechaColombia;
    }
    fechaActualColombia() {
        return (0, moment_timezone_1.default)().tz('America/Bogota').toDate();
    }
}
exports.FechaUtils = FechaUtils;

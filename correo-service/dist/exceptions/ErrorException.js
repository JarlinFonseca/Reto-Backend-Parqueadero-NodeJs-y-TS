"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorException = void 0;
class ErrorException extends Error {
    mensaje;
    status;
    isExceptionOwnError;
    constructor(mensaje, status) {
        super(mensaje);
        this.mensaje = mensaje;
        this.status = status;
        this.isExceptionOwnError = true;
    }
}
exports.ErrorException = ErrorException;

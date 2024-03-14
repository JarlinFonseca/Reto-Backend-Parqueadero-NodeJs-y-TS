"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerMiddleware = void 0;
class ErrorHandlerMiddleware {
    errorHandler(err, req, res, next) {
        if (err.isExceptionOwnError) {
            const rta = {
                message: err.mensaje
            };
            res.status(err.status).json(rta);
        }
        else {
            res.status(500).json({ message: 'Ocurrió un error en el servidor' });
        }
    }
}
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;

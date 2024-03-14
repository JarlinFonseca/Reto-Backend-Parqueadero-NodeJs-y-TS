import { NextFunction, Request, Response } from "express";

export class ErrorHandlerMiddleware {

    errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        if (err.isExceptionOwnError) {

            const rta = {
                message: err.mensaje
            };
            
            res.status(err.status).json(rta)

        } else {
            res.status(500).json({ message: 'Ocurrió un error en el servidor' });
        }

    }

}
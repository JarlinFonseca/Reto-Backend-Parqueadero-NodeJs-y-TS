import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";

export class ErrorHandlerMiddleware{

    constructor(){}

     errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

        console.error(err.stack);
        

        if (err.isExceptionOwnError) {

            if (err instanceof QueryFailedError) {
                console.error("Error de base de datos:", err.message);
                console.error("Query:", err.query);
                console.error("Parámetros:", err.parameters);
            }

            const rta = {
                message: err.mensaje
            };
    
            res.status(err.status).json(rta)

        }else{
            res.status(500).json({ message: 'Ocurrió un error en el servidor' });
        }
        

    }


}
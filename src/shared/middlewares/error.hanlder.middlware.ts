import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";

export class ErrorHandlerMiddleware{

    constructor(){}

     errorHandler(err: any | ValidationError, req: Request, res: Response, next: NextFunction) {
       // console.error(err.stack);
    

        if (err.isExceptionOwnError) {

            const rta = {
                message: err.mensaje
            };
    
            res.status(err.status).json(rta)

        }else{
                res.status(500).json({ message: 'Ocurrió un error en el servidor' });
            }
            
        }
        
    }
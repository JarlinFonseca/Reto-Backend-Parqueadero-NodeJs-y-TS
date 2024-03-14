import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../shared/response/http.response";
import { MessageService } from "../services/message.service";
import { ErrorException } from "../exceptions/ErrorException";

export class MessageController {

    private messageService: MessageService = new MessageService();

    constructor(
        private readonly httpResponse: HttpResponse = new HttpResponse()
    ) { }


    saveMessage(req: Request, res: Response, next: NextFunction) {
        this.messageService.sendMail(req.body)
            .then((data) => { return this.httpResponse.Created(res, data); })
            .catch((err) => next(err));
    }

    geFilteredEmails(req: Request, res: Response, next: NextFunction) {
        const { startDate, endDate } = req.query;

        // Define valores por defecto para startDate y endDate si no se proporcionan
        let parsedStartDate: Date | undefined;
        let parsedEndDate: Date | undefined;

        // Intentar convertir los valores de startDate y endDate a objetos Date si se proporcionan
        if (startDate && endDate) {
            if (typeof startDate !== 'string' || typeof endDate !== 'string') {
                throw new ErrorException("Los parámetros de fecha son inválidos", 400);
            }
            try {
                parsedStartDate = new Date(startDate.toString());
                parsedEndDate = new Date(endDate.toString());
            } catch (error) {
                throw new ErrorException("Los parámetros de fecha son inválidos", 400);
            }

            // Verificar que los objetos Date resultantes son válidos
            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                throw new ErrorException("Los parámetros de fecha son inválidos", 400);
            }
        }
        this.messageService.geFilteredEmails(parsedStartDate, parsedEndDate)
            .then((data) => { return this.httpResponse.Ok(res, data); })
            .catch((err) => next(err));


    }


}
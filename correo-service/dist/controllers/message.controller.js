"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const http_response_1 = require("../shared/response/http.response");
const message_service_1 = require("../services/message.service");
const ErrorException_1 = require("../exceptions/ErrorException");
class MessageController {
    httpResponse;
    messageService = new message_service_1.MessageService();
    constructor(httpResponse = new http_response_1.HttpResponse()) {
        this.httpResponse = httpResponse;
    }
    saveMessage(req, res, next) {
        this.messageService.sendMail(req.body)
            .then((data) => { return this.httpResponse.Created(res, data); })
            .catch((err) => next(err));
    }
    geFilteredEmails(req, res, next) {
        const { startDate, endDate } = req.query;
        // Define valores por defecto para startDate y endDate si no se proporcionan
        let parsedStartDate;
        let parsedEndDate;
        // Intentar convertir los valores de startDate y endDate a objetos Date si se proporcionan
        if (startDate && endDate) {
            if (typeof startDate !== 'string' || typeof endDate !== 'string') {
                throw new ErrorException_1.ErrorException("Los parámetros de fecha son inválidos", 400);
            }
            try {
                parsedStartDate = new Date(startDate.toString());
                parsedEndDate = new Date(endDate.toString());
            }
            catch (error) {
                throw new ErrorException_1.ErrorException("Los parámetros de fecha son inválidos", 400);
            }
            // Verificar que los objetos Date resultantes son válidos
            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                throw new ErrorException_1.ErrorException("Los parámetros de fecha son inválidos", 400);
            }
        }
        this.messageService.geFilteredEmails(parsedStartDate, parsedEndDate)
            .then((data) => { return this.httpResponse.Ok(res, data); })
            .catch((err) => next(err));
    }
}
exports.MessageController = MessageController;

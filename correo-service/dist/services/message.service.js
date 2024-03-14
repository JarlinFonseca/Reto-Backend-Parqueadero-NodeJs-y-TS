"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const history_mail_response_dto_1 = require("../dtos/response/history.mail.response.dto");
const message_response_dto_1 = require("../dtos/response/message.response.dto");
const message_repository_1 = require("../repositories/message.repository");
const http_response_1 = require("../shared/response/http.response");
const message_info_response_dto_1 = require("../dtos/response/message.info.response.dto");
const fecha_utils_1 = require("../shared/util/fecha.utils");
class MessageService {
    httpResponse;
    messageRepository = new message_repository_1.MessageRepository();
    fechaUtils = new fecha_utils_1.FechaUtils();
    constructor(httpResponse = new http_response_1.HttpResponse()) {
        this.httpResponse = httpResponse;
    }
    async sendMail(messageRequestDto) {
        this.messageRepository.saveMessage(messageRequestDto);
        return new message_response_dto_1.MessageResponseDto("Correo enviado");
    }
    async geFilteredEmails(startDate, endDate) {
        let messageList = [];
        messageList = await this.messageRepository.getEmailsBetweenDates(startDate, endDate);
        const quantityEmailSend = messageList.length;
        const messagesColombia = messageList.map((message) => {
            const messageInfoResponseDto = new message_info_response_dto_1.MessageInfoResponsetDto();
            messageInfoResponseDto.id = message.id;
            messageInfoResponseDto.email = message.placa;
            messageInfoResponseDto.description = message.description;
            messageInfoResponseDto.parkingLotName = message.parkingLotName;
            messageInfoResponseDto.dateSent = this.fechaUtils.convertirFechaUtcAColombia(message.dateSent);
            return messageInfoResponseDto;
        });
        console.log(messageList);
        return new history_mail_response_dto_1.HistoryMailResponseDto(messagesColombia, quantityEmailSend);
    }
}
exports.MessageService = MessageService;

import { Document, Types } from "mongoose";
import { MessageRequestDto } from "../dtos/request/message.request.dto";
import { HistoryMailResponseDto } from "../dtos/response/history.mail.response.dto";
import { MessageResponseDto } from "../dtos/response/message.response.dto";
import { IMessage } from "../models/message.model";
import { MessageRepository } from "../repositories/message.repository";
import { HttpResponse } from "../shared/response/http.response";
import { MessageInfoResponsetDto } from "../dtos/response/message.info.response.dto";
import { FechaUtils } from "../shared/util/fecha.utils";

export class MessageService {

    private messageRepository = new MessageRepository();
    private fechaUtils = new FechaUtils();
    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }

    async sendMail(messageRequestDto: MessageRequestDto): Promise<MessageResponseDto> {
        this.messageRepository.saveMessage(messageRequestDto);

        return new MessageResponseDto("Correo enviado");
    }

    async geFilteredEmails(startDate: any, endDate: any): Promise<HistoryMailResponseDto | null> {
        let messageList: (Document<unknown, {}, IMessage> & IMessage & { _id: Types.ObjectId; })[] = [];
        messageList = await this.messageRepository.getEmailsBetweenDates(startDate, endDate);


        const quantityEmailSend = messageList.length;
        const messagesColombia: MessageInfoResponsetDto[] = messageList.map((message) => {
            const messageInfoResponseDto = new MessageInfoResponsetDto();
            messageInfoResponseDto.id = message.id;
            messageInfoResponseDto.email = message.placa;
            messageInfoResponseDto.description = message.description;
            messageInfoResponseDto.parkingLotName = message.parkingLotName;
            messageInfoResponseDto.dateSent = this.fechaUtils.convertirFechaUtcAColombia(message.dateSent);
            return messageInfoResponseDto;
        });


        console.log(messageList);

        return new HistoryMailResponseDto(messagesColombia, quantityEmailSend);


    }



}
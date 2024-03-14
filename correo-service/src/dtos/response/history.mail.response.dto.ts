import { MessageInfoResponsetDto } from "./message.info.response.dto";

export class HistoryMailResponseDto{
    emails!: MessageInfoResponsetDto[];
    quantitySent!: number;

    constructor(emails: MessageInfoResponsetDto[], quantitySent:number){
        this.emails = emails;
        this.quantitySent = quantitySent;

    }


}
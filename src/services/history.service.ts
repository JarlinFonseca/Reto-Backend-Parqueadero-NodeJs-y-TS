import { HistoryEntity } from "../entities/history.entity";
import { HistoryRepository } from "../repositories/history.repository";
import { HttpResponse } from "../shared/response/http.response";

export class HistoryService {

    private historyRepository:HistoryRepository = new HistoryRepository();

    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()){}

    async saveHistory(history:HistoryEntity):Promise<void>{
        (await this.historyRepository.execRepository).save(history);
    }

}
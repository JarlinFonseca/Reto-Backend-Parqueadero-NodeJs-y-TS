import { BaseRepository } from "../config/base.repository";
import { HistoryEntity } from "../entities/history.entity";

export class HistoryRepository extends BaseRepository<HistoryEntity>{

    constructor(){
        super(HistoryEntity);
    }


}
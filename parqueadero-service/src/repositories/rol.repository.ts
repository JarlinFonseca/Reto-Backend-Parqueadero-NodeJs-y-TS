import { BaseRepository } from "../config/base.repository";
import { RolEntity } from "../entities/rol.entity";

export class RolRepository extends BaseRepository<RolEntity>{

    constructor(){
        super(RolEntity);
    }


}
import { BaseRepository } from "../config/base.repository";
import { ParkingLotEntity } from "../entities/parking.lot.entity";

export class ParkingLotRepository extends BaseRepository<ParkingLotEntity>{

    constructor(){
        super(ParkingLotEntity);
    }

    async findAllParkingLotsWithRelationUser(): Promise<ParkingLotEntity[] >{
        return (await this.execRepository)
        .createQueryBuilder('parking_lot')
        .leftJoinAndSelect('parking_lot.user', 'user')
        .getMany();
      }

      async findParkingLotByIdWithRelationUser(id:number): Promise<ParkingLotEntity | null >{
        return (await this.execRepository)
        .createQueryBuilder('parking_lot')
        .leftJoinAndSelect('parking_lot.user', 'user')
        .where({id})
        .getOne();
      }
}
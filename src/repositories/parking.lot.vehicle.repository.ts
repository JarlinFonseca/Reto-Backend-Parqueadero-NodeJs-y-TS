import { BaseRepository } from "../config/base.repository";
import { ParkingLotVehicleEntity } from "../entities/parking.lot.vehicle.entity";

export class ParkingLotVehicleRepositoty extends BaseRepository<ParkingLotVehicleEntity>{

    constructor(){
        super(ParkingLotVehicleEntity);
    }

    async getCountVehiclesParkingLot(parking_lot_id: number): Promise<number> {
        const entityManager = (await this.execRepository)
        const query = `
            SELECT COUNT(*)
            FROM parking_lots_vehicles
            WHERE parking_lot_id= $1
            AND active_entry_flag=true
        `;
        const countVehicles = await entityManager.query(query, [parking_lot_id]);
        return countVehicles;
    }

    async findByVehicleIdAndActiveEntryFlag(vehicleId:number, activeEntryFlag:boolean): Promise<ParkingLotVehicleEntity | null >{
        return (await this.execRepository)
        .createQueryBuilder('parkingLotVehicle')
        .leftJoinAndSelect('parkingLotVehicle.parkingLot', 'parkingLot')
        .leftJoinAndSelect('parkingLotVehicle.vehicle', 'vehicle')
        .where({
            vehicle: { id: vehicleId }, // Usando la relación vehicle y su id
            activeEntryFlag,
        })
        .getOne();
      }
}








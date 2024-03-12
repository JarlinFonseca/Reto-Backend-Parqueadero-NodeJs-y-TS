﻿import { BaseRepository } from "../config/base.repository";
import { ParkingLotVehicleEntity } from "../entities/parking.lot.vehicle.entity";

export class ParkingLotVehicleRepositoty extends BaseRepository<ParkingLotVehicleEntity>{

    constructor() {
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
        const countVehiclesArray = await entityManager.query(query, [parking_lot_id]);
     
        return this.convertArrayResultsToNumber(countVehiclesArray);
    }

    private async convertArrayResultsToNumber(resultArray:any) {
        // Verifica si hay al menos un resultado en el array
        if (resultArray.length > 0) {
            // Extrae el valor numérico de la propiedad 'count', el 10 indica que la cadena que se está convirtiendo representa un número decimal
            const countVehicles: number = parseInt(resultArray[0].count, 10);
            console.log(countVehicles);
            return countVehicles;
        } else {
            return 0;
        }
    }

    async findByVehicleIdAndActiveEntryFlag(vehicleId: number, activeEntryFlag: boolean): Promise < ParkingLotVehicleEntity | null > {
            return(await this.execRepository)
        .createQueryBuilder('parkingLotVehicle')
                .leftJoinAndSelect('parkingLotVehicle.parkingLot', 'parkingLot')
                .leftJoinAndSelect('parkingLotVehicle.vehicle', 'vehicle')
                .leftJoinAndSelect('parkingLot.user', 'user') // Agregando la relación con UserEntity
                .where({
                    vehicle: { id: vehicleId }, // Usando la relación vehicle y su id
                    activeEntryFlag,
                })
                .getOne();
        }
    }








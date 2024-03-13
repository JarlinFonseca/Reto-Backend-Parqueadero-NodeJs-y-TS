import { BaseRepository } from "../config/base.repository";
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

    private async convertArrayResultsToNumber(resultArray: any) {
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

    async findByVehicleIdAndActiveEntryFlag(vehicleId: number, activeEntryFlag: boolean): Promise<ParkingLotVehicleEntity | null> {
        return (await this.execRepository)
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

    async findAllByParkingLotIdAndActiveEntryFlag(parkingLotId: number, activeEntryFlag: boolean): Promise<ParkingLotVehicleEntity[] | null> {
        return (await this.execRepository)
            .createQueryBuilder('parkingLotVehicle')
            .leftJoinAndSelect('parkingLotVehicle.parkingLot', 'parkingLot')
            .leftJoinAndSelect('parkingLotVehicle.vehicle', 'vehicle')
            .leftJoinAndSelect('parkingLot.user', 'user') // Agregando la relación con UserEntity
            .where({
                parkingLot: { id: parkingLotId }, // Usando la relación parkingLot y su id
                activeEntryFlag,
            })
            .getMany();

    }

    async getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTenAdmin(): Promise<{ vehicle_id: number, cantidadVecesRegistrado: number }[]> {
        return (await this.execRepository)
            .createQueryBuilder('plv')
            .select('plv.vehicle_id', 'vehicle_id')
            .addSelect('COUNT(plv.vehicle_id)', 'cantidadVecesRegistrado')
            .groupBy('plv.vehicle_id')
            .orderBy('"cantidadVecesRegistrado"', 'DESC')
            .limit(10)
            .getRawMany();

    }

    async getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTenSocio(user_id: number): Promise<{ vehicle_id: number, cantidadVecesRegistrado: number }[]> {
        return (await this.execRepository)
            .createQueryBuilder('pv')
            .select('vehicle_id, COUNT(vehicle_id) AS "cantidadVecesRegistrado"')
            .innerJoin('pv.parkingLot', 'p')
            .innerJoin('p.user', 'u')
            .where('u.id = :user_id', { user_id })
            .groupBy('vehicle_id')
            .orderBy('"cantidadVecesRegistrado"', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async getVehiclesMoreTimesRegisteredByParkingLotId(parqueaderoId: number): Promise<{ vehicle_id: number, parking_lot_id: number, cantidadVecesRegistrado: number }[]> {
        const entityManager = (await this.execRepository)
        const query = `
          SELECT vehicle_id, parking_lot_id, COUNT(vehicle_id) AS cantidadVecesRegistrado
          FROM parking_lots_vehicles
          WHERE parking_lot_id = $1
          GROUP BY vehicle_id, parking_lot_id
          ORDER BY cantidadVecesRegistrado DESC
          LIMIT 10
        `;

        const result = await entityManager.query(query, [parqueaderoId]);

        return result;
    }

    async getVehiclesParkedForFirstTimeByParkingLotId(parkingLotId: number): Promise<{ parking_lot_id: number, vehicle_id: number, created_entry: Date }[]> {
        const entityManager = (await this.execRepository)
        const query = `
        SELECT parking_lot_id , vehicle_id , created_entry  FROM parking_lots_vehicles plv  
            WHERE parking_lot_id  =$1 AND 
            vehicle_id NOT in(select pv.vehicle_id  from history h join parking_lots_vehicles pv on(h.parking_lot_vehicle_id=pv.id) 
            GROUP by pv.vehicle_id ) AND vehicle_id IN 
            (SELECT vehicle_id FROM parking_lots_vehicles  
            WHERE parking_lot_id  = $1 
            GROUP BY vehicle_id 
            HAVING COUNT(vehicle_id) = 1)
      `;
        const result = await entityManager.query(query, [parkingLotId]);

        return result;
    }

    async getVehiclesParkedByCoincidence(placa: string):Promise<{ id: number, placa: string, created_entry: Date }[]>{
        const entityManager = (await this.execRepository)
        const query = `
        SELECT pv.id, v.placa, pv.created_entry  
        FROM parking_lots_vehicles  pv JOIN vehicles  v 
        ON (pv.vehicle_id =v.id) 
        WHERE pv.active_entry_flag =true AND v.placa like $1
      `;
        const result = await entityManager.query(query, [`%${placa}%`]);

        return result;
    }

    async  getVehiclesByCoincidencePlacaAndParkingLots(placa: string, idsParqueaderos: number[]): Promise<{ id: number, placa: string, created_entry: Date }[]> {
        const entityManager = (await this.execRepository)
        const query = `
            SELECT pv.id, v.placa, pv.created_entry  
            FROM parking_lots_vehicles pv 
            JOIN vehicles v ON pv.vehicle_id = v.id
            WHERE pv.active_entry_flag = true AND v.placa LIKE $1 
            AND pv.parking_lot_id IN (${idsParqueaderos.map((_, index) => `$${index + 2}`).join(', ')})
        `;

        const parameters = [`%${placa}%`, ...idsParqueaderos];
        const result = await entityManager.query(query, parameters);
    
        return result;
    }


}










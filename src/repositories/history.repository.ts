import { BaseRepository } from "../config/base.repository";
import { HistoryEntity } from "../entities/history.entity";

export class HistoryRepository extends BaseRepository<HistoryEntity>{

    constructor() {
        super(HistoryEntity);
    }

    async getProfitsWeek(parkingLotId: number, weekActual: number, month: number, year: number): Promise<number> {
        const entityManager = (await this.execRepository)
        const query = `
        SELECT SUM(h.total_payment) as "totalProfits"
        FROM parking_lots_vehicles pv 
        JOIN history h ON (pv.id = h.parking_lot_vehicle_id) 
        WHERE pv.parking_lot_id = $1
        AND EXTRACT(WEEK FROM h.departure_date) = $2
        AND EXTRACT(MONTH FROM h.departure_date) = $3
        AND EXTRACT(YEAR FROM h.departure_date) = $4
      `;

        const parameters = [parkingLotId, weekActual, month, year];
        const result = await entityManager.query(query, parameters);

        return await this.convertArrayResultsToNumber(result);
    }

    async getProfitsMonth(parkingLotId: number, month: number, year: number): Promise<number> {
        const entityManager = (await this.execRepository)
        const query = `
        SELECT SUM(h.total_payment) as "totalProfits"
        FROM parking_lots_vehicles pv 
        JOIN history h ON (pv.id = h.parking_lot_vehicle_id) 
        WHERE pv.parking_lot_id = $1
        AND EXTRACT(MONTH FROM h.departure_date) = $2
        AND EXTRACT(YEAR FROM h.departure_date) = $3
      `;

        const parameters = [parkingLotId, month, year];
        const result = await entityManager.query(query, parameters);

        return await this.convertArrayResultsToNumber(result);
    }

    async getProfitsYear(parkingLotId: number, year: number): Promise<number> {
        const entityManager = (await this.execRepository)
        const query = `
        SELECT SUM(h.total_payment) as "totalProfits"
        FROM parking_lots_vehicles pv 
        JOIN history h ON (pv.id = h.parking_lot_vehicle_id) 
        WHERE pv.parking_lot_id = $1
        AND EXTRACT(YEAR FROM h.departure_date) = $2
      `;

        const parameters = [parkingLotId, year];
        const result = await entityManager.query(query, parameters);

        return await this.convertArrayResultsToNumber(result);
    }

    async getProfitsToday(parkingLotId: number, dateToday: string): Promise<number>{
        const entityManager = (await this.execRepository)
        const query = `
        SELECT SUM(h.total_payment) as "totalProfits"
        FROM parking_lots_vehicles pv 
        JOIN history h ON (pv.id = h.parking_lot_vehicle_id) 
        WHERE pv.parking_lot_id = $1 AND
        TO_CHAR(departure_date, 'YYYY-MM-DD') LIKE $2
      `;

        const parameters = [parkingLotId, dateToday];
        const result = await entityManager.query(query, parameters);

        return await this.convertArrayResultsToNumber(result);

    }

    async  convertArrayResultsToNumber(result: any[]): Promise<number> {
        // Extrae el total de beneficios del primer resultado (si hay alguno)
        const totalProfits = result.length > 0 ? result[0].totalProfits : 0;      
        // Convierte el total a un número y lo retorna
        return parseFloat(totalProfits) || 0;
      }




}
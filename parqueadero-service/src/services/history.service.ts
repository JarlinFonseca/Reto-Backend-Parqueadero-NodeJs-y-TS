import { format, getISOWeek, getMonth, getYear } from "date-fns";
import { ProfitsResponseDto } from "../dto/response/profits.response.dto";
import { VehicleParkedResponseDto } from "../dto/response/vehicle.parked.response.dto";
import { HistoryEntity } from "../entities/history.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { HistoryRepository } from "../repositories/history.repository";
import { ParkingLotRepository } from "../repositories/parking.lot.repository";
import { ParkingLotVehicleRepositoty } from "../repositories/parking.lot.vehicle.repository";
import { HttpResponse } from "../shared/response/http.response";
import { FechaUtils } from "../shared/util/fecha.utils";
import { TokenService } from "./token.service";
import { VehicleService } from "./vehicle.service";

export class HistoryService {

    private historyRepository: HistoryRepository = new HistoryRepository();
    private parkingLotVehicleRepository: ParkingLotVehicleRepositoty = new ParkingLotVehicleRepositoty();
    private parkingLotRepository: ParkingLotRepository = new ParkingLotRepository();
    private tokenService: TokenService = new TokenService();
    private vehicleService: VehicleService = new VehicleService();
    private fechaUtils: FechaUtils = new FechaUtils();


    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }

    async saveHistory(history: HistoryEntity): Promise<void> {
        (await this.historyRepository.execRepository).save(history);
    }

    async getVehiclesParkedForFirstTimeByParkingLotId(parkingLotId: number, tokenJwt: string): Promise<VehicleParkedResponseDto[]> {
        if (await this.isRolSocio(tokenJwt)) await this.verifyPartnerAuth(parkingLotId, tokenJwt);

        const parkingLot = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(parkingLotId));
        if (!parkingLot) throw new ErrorException("El parqueadero no existe", 404);

        const vehiclesFirstTime = await this.parkingLotVehicleRepository.getVehiclesParkedForFirstTimeByParkingLotId(parkingLotId);

        return await Promise.all(vehiclesFirstTime.map(async (vehicleP) => {
            const vehicleParkedResponseDto = new VehicleParkedResponseDto();
            vehicleParkedResponseDto.id = Number(vehicleP.vehicle_id);
            const vehicle = await this.vehicleService.getVehicleById(vehicleP.vehicle_id);
            if (!vehicle) throw new ErrorException("El vehiculo no existe", 409);
            vehicleParkedResponseDto.placa = vehicle.placa;
            vehicleParkedResponseDto.entryDate = this.fechaUtils.convertirFechaUtcAColombia(vehicleP.created_entry);

            return vehicleParkedResponseDto;
        }));
    }

    async getProfits(parkingLotId: number, tokenJwt: string): Promise<ProfitsResponseDto > {

        await this.verifyPartnerAuth(parkingLotId, tokenJwt);
        const currentDate = new Date();
        const weekNumber = getISOWeek(currentDate);
        const monthNumber = getMonth(currentDate) + 1; // Meses en JavaScript son de 0 a 11
        const yearNumber = getYear(currentDate);
        const dateToday = format(currentDate, 'yyyy-MM-dd');

        let currentYearProfits = await this.historyRepository.getProfitsYear(parkingLotId, yearNumber);
        let currentMonthProfits = await this.historyRepository.getProfitsMonth(parkingLotId, monthNumber, yearNumber);
        let currentWeekProfits = await this.historyRepository.getProfitsWeek(parkingLotId, weekNumber, monthNumber, yearNumber);
        let currentTodayProfits = await this.historyRepository.getProfitsToday(parkingLotId, dateToday);

        const WORD_SENTENCE = ' son: ';

        const profitsResponseDto = new ProfitsResponseDto();
        profitsResponseDto.today = `Las ganancias de la fecha de hoy ${dateToday}${WORD_SENTENCE}${this.formatCurrency(currentTodayProfits)}`;
        profitsResponseDto.week = `Las ganancias de esta semana${WORD_SENTENCE}${this.formatCurrency(currentWeekProfits)}`;
        profitsResponseDto.month = `Las ganancias del mes de ${new Date().toLocaleString('es', { month: 'long' })}${WORD_SENTENCE}${this.formatCurrency(currentMonthProfits)}`;
        profitsResponseDto.year = `Las ganancias del año de ${yearNumber}${WORD_SENTENCE}${this.formatCurrency(currentYearProfits)}`;

        return profitsResponseDto;
    }


    private formatCurrency(value: number): string {
        const formatoMoneda = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        });
        return formatoMoneda.format(value);
    }



    private async verifyPartnerAuth(parkingLotId: number, tokenJwt: string): Promise<number> {
        if (!tokenJwt) throw new ErrorException("No existe el token JWT", 409);
        const idPartnerAuth = await this.tokenService.obtenerIdDesdeToken(tokenJwt);

        const parkingLot = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(parkingLotId));
        if (!parkingLot) throw new ErrorException("El parqueadero no existe", 404);
        const idPartnerParkingLot = parkingLot.user.id;

        if (idPartnerAuth != idPartnerParkingLot) throw new ErrorException("No es socio del parqueadero", 409);

        return idPartnerAuth;
    }

    private async isRolSocio(tokenJwt: string): Promise<boolean> {
        if (!tokenJwt) throw new ErrorException("No existe el token JWT", 409);
        const rolPartnerAuth = await this.tokenService.getRolFromToken(tokenJwt);
        return rolPartnerAuth === "SOCIO";
    }



}
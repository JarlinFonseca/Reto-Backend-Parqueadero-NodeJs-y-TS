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

    private historyRepository:HistoryRepository = new HistoryRepository();
    private parkingLotVehicleRepository: ParkingLotVehicleRepositoty = new ParkingLotVehicleRepositoty();
    private parkingLotRepository: ParkingLotRepository = new ParkingLotRepository();
    private tokenService: TokenService = new TokenService();
    private vehicleService: VehicleService = new VehicleService();
    private fechaUtils: FechaUtils = new FechaUtils();


    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()){}

    async saveHistory(history:HistoryEntity):Promise<void>{
        (await this.historyRepository.execRepository).save(history);
    }

    async getVehiclesParkedForFirstTimeByParkingLotId(parkingLotId: number, tokenJwt: string):Promise<VehicleParkedResponseDto[]>{
        if(await this.isRolSocio(tokenJwt)) await this.verifyPartnerAuth(parkingLotId, tokenJwt);

        const parkingLot = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(parkingLotId));
        if (!parkingLot) throw new ErrorException("El parqueadero no existe", 404);

        const vehiclesFirstTime = await this.parkingLotVehicleRepository.getVehiclesParkedForFirstTimeByParkingLotId(parkingLotId);

        return await Promise.all(vehiclesFirstTime.map(async (vehicleP)=>{
            const vehicleParkedResponseDto = new VehicleParkedResponseDto();
            vehicleParkedResponseDto.id = Number(vehicleP.vehicle_id);
            const vehicle = await this.vehicleService.getVehicleById(vehicleP.vehicle_id);
            if (!vehicle) throw new ErrorException("El vehiculo no existe", 409);
            vehicleParkedResponseDto.placa = vehicle.placa;
            vehicleParkedResponseDto.entryDate = this.fechaUtils.convertirFechaUtcAColombia(vehicleP.created_entry);

            return vehicleParkedResponseDto;
        }));
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
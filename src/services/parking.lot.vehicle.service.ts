import { EntryVehicleParkingLotRequestDto } from "../dto/request/entry.vehicle.parking.lot.request.dto";
import { EntryVehicleParkingLotResponseDto } from "../dto/response/entry.vehicle.parking.lot.response.dto";
import { ParkingLotVehicleEntity } from "../entities/parking.lot.vehicle.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { ParkingLotRepository } from "../repositories/parking.lot.repository";
import { ParkingLotVehicleRepositoty } from "../repositories/parking.lot.vehicle.repository";
import { UserRepository } from "../repositories/user.repository";
import { HttpResponse } from "../shared/response/http.response";
import { FechaUtils } from "../shared/util/fecha.utils";
import { TokenService } from "./token.service";
import { VehicleService } from "./vehicle.service";

export class ParkingLotVehicleService {

    private parkingLotRepository = new ParkingLotRepository();
    private parkingLotVehicleRepository: ParkingLotVehicleRepositoty = new ParkingLotVehicleRepositoty();
    private userRepository = new UserRepository();
    private tokenService: TokenService = new TokenService();
    private vehicleServie: VehicleService = new VehicleService();
    private fechaUtils: FechaUtils = new FechaUtils();

    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }


    async registerVehicleEntry(entryVehicleParkingLotRequestDto: EntryVehicleParkingLotRequestDto, tokenJwt: string): Promise<EntryVehicleParkingLotResponseDto | null> {
        await this.verifyPartnerAuth(entryVehicleParkingLotRequestDto.parkingLotId, tokenJwt);
        const countMaxVehicles = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(entryVehicleParkingLotRequestDto.parkingLotId))!.quantityVehiclesMaximum;
        const currentVehicleQuantity = await this.parkingLotVehicleRepository.getCountVehiclesParkingLot(entryVehicleParkingLotRequestDto.parkingLotId);

        const placa: string = entryVehicleParkingLotRequestDto.placa.toUpperCase();

        if ((countMaxVehicles - currentVehicleQuantity) <= 0) throw new ErrorException("El parqueadero ya esta lleno, la cantidad de vehiculos limite ha sido superada", 409);

        const vehicle = await this.vehicleServie.getVehicleByPlaca(placa);
        if (await this.vehicleServie.verifyExistVehicle(vehicle)) throw new ErrorException("No se puede Registrar Ingreso, ya existe la placa en este u otro parqueadero", 409);

        const vehicleSave =  await this.vehicleServie.saveVehicle(placa, vehicle);

        const parkingLot = await this.parkingLotRepository.findParkingLotByIdWithRelationUser(entryVehicleParkingLotRequestDto.parkingLotId);

        if (!parkingLot) throw new ErrorException("El parqueadero no existe", 404);

        const parkingLotVehicle = new ParkingLotVehicleEntity();
        parkingLotVehicle.createdEntry = this.fechaUtils.fechaActualColombia();
        parkingLotVehicle.activeEntryFlag = true;
        parkingLotVehicle.vehicle = vehicleSave;
        parkingLotVehicle.parkingLot = parkingLot;
        (await this.parkingLotVehicleRepository.execRepository).save(parkingLotVehicle);

        const entryVehicleParkingLotResponseDto = new EntryVehicleParkingLotResponseDto();
        entryVehicleParkingLotResponseDto.id = vehicleSave.id;

        return entryVehicleParkingLotResponseDto;

    }

    private async verifyPartnerAuth(parkingLotId: number, tokenJwt: string): Promise<number> {
        if (!tokenJwt) throw new ErrorException("No existe el token JWT", 409);
        const idPartnerAuth = await this.tokenService.obtenerIdDesdeToken(tokenJwt);

        const parkingLot = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(parkingLotId));
        if (!parkingLot) throw new ErrorException("El parqueadero no existe", 404);
        const idPartnerParkingLot = parkingLot!.user.id;

        if (idPartnerAuth != idPartnerParkingLot) throw new ErrorException("No es socio del parqueadero", 409);

        return idPartnerAuth;
    }







}
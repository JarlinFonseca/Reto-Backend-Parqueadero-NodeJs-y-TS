import { EntryVehicleParkingLotRequestDto } from "../dto/request/entry.vehicle.parking.lot.request.dto";
import { ExitVehicleParkingLotRequestDto } from "../dto/request/exit.vehicle.parking.lot.request.dto";
import { EntryVehicleParkingLotResponseDto } from "../dto/response/entry.vehicle.parking.lot.response.dto";
import { ExitVehicleParkingLotResponseDto } from "../dto/response/exit.vehicle.parking.lot.response.dto";
import { IndicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto } from "../dto/response/indicator.vehicles.more.times.registered.different.parking.lots.response.dto";
import { IndicatorVehiclesMoreTimesRegisteredResponseDto } from "../dto/response/indicator.vehicles.more.times.registered.response.dto";
import { VehicleParkedResponseDto } from "../dto/response/vehicle.parked.response.dto";
import { HistoryEntity } from "../entities/history.entity";
import { ParkingLotVehicleEntity } from "../entities/parking.lot.vehicle.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { ParkingLotRepository } from "../repositories/parking.lot.repository";
import { ParkingLotVehicleRepositoty } from "../repositories/parking.lot.vehicle.repository";
import { UserRepository } from "../repositories/user.repository";
import { HttpResponse } from "../shared/response/http.response";
import { FechaUtils } from "../shared/util/fecha.utils";
import { HistoryService } from "./history.service";
import { ParkingLotService } from "./parking.lot.service";
import { TokenService } from "./token.service";
import { VehicleService } from "./vehicle.service";

export class ParkingLotVehicleService {

    private parkingLotRepository = new ParkingLotRepository();
    private parkingLotVehicleRepository: ParkingLotVehicleRepositoty = new ParkingLotVehicleRepositoty();
    private userRepository = new UserRepository();
    private tokenService: TokenService = new TokenService();
    private vehicleServie: VehicleService = new VehicleService();
    private historyService: HistoryService = new HistoryService();
    private parkingLotService: ParkingLotService = new ParkingLotService();
    private fechaUtils: FechaUtils = new FechaUtils();

    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }


    async registerVehicleEntry(entryVehicleParkingLotRequestDto: EntryVehicleParkingLotRequestDto, tokenJwt: string): Promise<EntryVehicleParkingLotResponseDto> {
        await this.verifyPartnerAuth(entryVehicleParkingLotRequestDto.parkingLotId, tokenJwt);
        const countMaxVehicles = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(entryVehicleParkingLotRequestDto.parkingLotId))!.quantityVehiclesMaximum;
        const currentVehicleQuantity = await this.parkingLotVehicleRepository.getCountVehiclesParkingLot(entryVehicleParkingLotRequestDto.parkingLotId);

        console.log(countMaxVehicles)
        console.log(currentVehicleQuantity)

        console.log((countMaxVehicles - Number(currentVehicleQuantity)) <= 0)
        const placa: string = entryVehicleParkingLotRequestDto.placa.toUpperCase();

        if ((countMaxVehicles - currentVehicleQuantity) <= 0) throw new ErrorException("El parqueadero ya esta lleno, la cantidad de vehiculos limite ha sido superada", 409);

        const vehicle = await this.vehicleServie.getVehicleByPlaca(placa);
        if (await this.vehicleServie.verifyExistVehicle(vehicle)) throw new ErrorException("No se puede Registrar Ingreso, ya existe la placa en este u otro parqueadero", 409);

        const vehicleSave = await this.vehicleServie.saveVehicle(placa, vehicle);

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

    async registerVehicleExit(exitVehicleParkingLotRequestDto: ExitVehicleParkingLotRequestDto, tokenJwt: string): Promise<ExitVehicleParkingLotResponseDto> {

        const idPartnerAuth = await this.verifyPartnerAuth(exitVehicleParkingLotRequestDto.parkingLotId, tokenJwt);

        const placa: string = exitVehicleParkingLotRequestDto.placa.toUpperCase();
        const vehicle = await this.vehicleServie.getVehicleByPlaca(placa);
        if (!await this.vehicleServie.verifyExistVehicle(vehicle)) throw new ErrorException("No se puede Registrar Salida, no existe la placa en el parqueadero", 409);

        const parkingLotVehicle = await this.parkingLotVehicleRepository.findByVehicleIdAndActiveEntryFlag(vehicle!.id, true);
        if (!parkingLotVehicle) throw new ErrorException("El vehiculo no se encontro parqueado", 409)
        if (Number(parkingLotVehicle.parkingLot.id) !== exitVehicleParkingLotRequestDto.parkingLotId) throw new ErrorException("El vehiculo no pertenece al parqueadero dado", 409);

        if (idPartnerAuth !== parkingLotVehicle.parkingLot.user.id) throw new ErrorException("El usuario autenticado no es SOCIO del parqueadero", 409);

        const departureDate = this.fechaUtils.fechaActualColombia();
        const entryDate = parkingLotVehicle.createdEntry;

        const costHourVehicle = parkingLotVehicle.parkingLot.costHourVehicle;
        let hours = this.getHours(entryDate, departureDate);

        if (hours < 1) hours = 1.0;
        let paymentTotal = Math.round(hours * costHourVehicle);

        const history = new HistoryEntity();
        history.entryDate = entryDate;
        history.departureDate = departureDate;
        history.totalPayment = paymentTotal;


        parkingLotVehicle.activeEntryFlag = false;
        (await this.parkingLotVehicleRepository.execRepository).save(parkingLotVehicle)


        history.parkingLotVehicle = parkingLotVehicle;
        await this.historyService.saveHistory(history);

        return new ExitVehicleParkingLotResponseDto("Salida registrada");
    }

    async getVehiclesParkedByParkingLotId(parkingLotId: number, tokenJwt: string): Promise<VehicleParkedResponseDto[]> {
        if (await this.isRolSocio(tokenJwt)) await this.verifyPartnerAuth(parkingLotId, tokenJwt);
        if (!await this.parkingLotService.verifyExistParkingLot(parkingLotId)) throw new ErrorException("El parqueadero no existe", 404);

        const parkingLotVehicles = await this.parkingLotVehicleRepository.findAllByParkingLotIdAndActiveEntryFlag(parkingLotId, true);

        return parkingLotVehicles!.map((parkingLotVehicle) => {
            const vehicleParkedResponseDto = new VehicleParkedResponseDto();
            vehicleParkedResponseDto.id = Number(parkingLotVehicle.id);
            vehicleParkedResponseDto.placa = parkingLotVehicle.vehicle.placa;
            vehicleParkedResponseDto.entryDate = this.fechaUtils.convertirFechaUtcAColombia(parkingLotVehicle.createdEntry);
            return vehicleParkedResponseDto;
        });
    }

    async getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTen(tokenJwt: string): Promise<IndicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto[]> {
        let vehicles;
        if (await this.isRolSocio(tokenJwt)) vehicles = await this.parkingLotVehicleRepository.getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTenSocio(await this.tokenService.obtenerIdDesdeToken(tokenJwt));
        else vehicles = await this.parkingLotVehicleRepository.getVehiclesMoreTimesRegisteredInDifferentParkingLotsLimitTenAdmin();

        return await Promise.all(vehicles.map(async (vehicleParkingLot) => {
            const indicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto = new IndicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto();
            const vehicle = await this.vehicleServie.getVehicleById(vehicleParkingLot.vehicle_id);
            if (!vehicle) throw new ErrorException("El vehiculo no existe", 409);
            vehicle.id = Number(vehicle.id);
            indicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto.vehicle = vehicle;
            indicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto.quantityTimesRegistered = Number(vehicleParkingLot.cantidadVecesRegistrado);

            return indicatorVehiclesMoreTimesRegisteredDifferentParkingLotsResponseDto;
        }));
    }

    async getVehiclesMoreTimesRegisteredByParkingLotId(parkingLotId: number, tokenJwt: string): Promise<IndicatorVehiclesMoreTimesRegisteredResponseDto[]> {
        if (await this.isRolSocio(tokenJwt)) await this.verifyPartnerAuth(parkingLotId, tokenJwt);

        const parkingLot = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(parkingLotId));
        if (!parkingLot) throw new ErrorException("El parqueadero no existe", 404);

        let vehicles = await this.parkingLotVehicleRepository.getVehiclesMoreTimesRegisteredByParkingLotId(parkingLotId);

        return await Promise.all(vehicles.map(async (vehicleParkingLot) => {
            const indicatorVehiclesMoreTimesRegisteredResponseDto = new IndicatorVehiclesMoreTimesRegisteredResponseDto();
            const vehicle = await this.vehicleServie.getVehicleById(vehicleParkingLot.vehicle_id);
            if (!vehicle) throw new ErrorException("El vehiculo no existe", 409);
            vehicle.id = Number(vehicle.id);
            indicatorVehiclesMoreTimesRegisteredResponseDto.vehicle = vehicle;
            const parkingLot = await this.parkingLotService.findParkingLotById(vehicleParkingLot.parking_lot_id);
            if (!parkingLot) throw new ErrorException("El parqueadero no existe", 409);
            indicatorVehiclesMoreTimesRegisteredResponseDto.nameParkingLot = parkingLot.name;
            indicatorVehiclesMoreTimesRegisteredResponseDto.quantityTimesRegistered = vehicleParkingLot.cantidadVecesRegistrado;
            return indicatorVehiclesMoreTimesRegisteredResponseDto;
        }));
    }

    async getVehiclesParkedByCoincidence(placa: string, tokenJwt: string): Promise<VehicleParkedResponseDto[]> {
        let vehicles = await this.parkingLotVehicleRepository.getVehiclesParkedByCoincidence(placa);
        if (await this.isRolSocio(tokenJwt)) {
            const idPartnerAuth = await this.tokenService.obtenerIdDesdeToken(tokenJwt);
            const parkingLotsPartner = await this.parkingLotRepository.findAllParkingLotByUserId(idPartnerAuth);
            if (parkingLotsPartner.length <= 0) throw new ErrorException("No hay coincidencias de placas de vehiculos de acuerdo a lo ingresado.", 404);

            const idsParkingLots = parkingLotsPartner.map((parkingLot) => parkingLot.id);
            vehicles = await this.parkingLotVehicleRepository.getVehiclesByCoincidencePlacaAndParkingLots(placa, idsParkingLots);
        } else {
            vehicles = await this.parkingLotVehicleRepository.getVehiclesParkedByCoincidence(placa);
        }

        if (vehicles.length === 0) {
            throw new ErrorException("No hay coincidencias de placas de vehiculos de acuerdo a lo ingresado.", 404);
        }

        return await Promise.all(vehicles.map(async (vehicle) => {
            const vehicleParkedResponseDto = new VehicleParkedResponseDto();
            const parkingLotVehicle = await (await this.parkingLotVehicleRepository.execRepository).findOneBy({ id: vehicle.id });
            if (!parkingLotVehicle) throw new ErrorException("No existe el vehiculo en el parqueadero.", 404);
            vehicleParkedResponseDto.id = parkingLotVehicle.id;
            vehicleParkedResponseDto.placa = vehicle.placa;
            vehicleParkedResponseDto.entryDate = this.fechaUtils.convertirFechaUtcAColombia(vehicle.created_entry);

            return vehicleParkedResponseDto;
        }));


    }

    private getHours(entryDate: Date, departureDate: Date) {
        const initialTime = entryDate.getTime();
        const finalTime = departureDate.getTime();
        let rest = (finalTime - initialTime);
        rest = rest / 3600000;
        return rest;
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
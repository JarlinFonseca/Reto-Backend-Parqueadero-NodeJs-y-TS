import { DeleteResult } from "typeorm";
import { ParkingLotRequestDto } from "../dto/request/parking.lot.request.dto";
import { ParkingLotResponseDto } from "../dto/response/parking.lot.response.dto";
import { UserEntity } from "../entities/user.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { ParkingLotResponseMapper } from "../mapper/parking.lot.response.mapper";
import { ParkingLotRepository } from "../repositories/parking.lot.repository";
import { UserRepository } from "../repositories/user.repository";
import { HttpResponse } from "../shared/response/http.response";
import { ParkingLotEntity } from "../entities/parking.lot.entity";


export class ParkingLotService {

    private parkingLotRepository = new ParkingLotRepository();
    private userRepository = new UserRepository();
    private parkingLotResponseMapper: ParkingLotResponseMapper = new ParkingLotResponseMapper();
    private ID_ROL_SOCIO: number = 2;


    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }

    async saveParkingLot(body: ParkingLotRequestDto): Promise<ParkingLotResponseDto> {
        const id: number = body.partnerId;
        const user = await this.validateUser(id);

        const newParkingLot = (await this.parkingLotRepository.execRepository).create(body);
        newParkingLot.user = user;

        const parkingLot = await (await this.parkingLotRepository.execRepository).save(newParkingLot);

        return this.parkingLotResponseMapper.toResponse(parkingLot)
    }

    async findAllParkingLots(): Promise<ParkingLotResponseDto[]> {
        const parkingLotsEntity = await this.parkingLotRepository.findAllParkingLotsWithRelationUser();

        let parkingLots: ParkingLotResponseDto[] = [];

        parkingLotsEntity.map((parkingLot) => {
            const parkinLotResponseDto = this.parkingLotResponseMapper.toResponse(parkingLot)
            parkingLots.push(parkinLotResponseDto);
        })

        return parkingLots;
    }

    async findParkingLotById(id: number): Promise<ParkingLotResponseDto> {

        const parkingLotEntity = await this.parkingLotRepository.findParkingLotByIdWithRelationUser(id);

        if (!parkingLotEntity) throw new ErrorException("El parqueadero no existe", 404);

        return this.parkingLotResponseMapper.toResponse(parkingLotEntity);
    }

    async updateParkingLot(id: number, infoUpdate: ParkingLotRequestDto): Promise<ParkingLotResponseDto> {
        const parkingLotEntity = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(id));
        if (!parkingLotEntity) throw new ErrorException("El parqueadero no existe", 404);

        const userEntity = await (await this.userRepository.execRepository).findOneBy({ id: infoUpdate.partnerId })
        if (!userEntity) throw new ErrorException("El usuario no existe", 404);

        parkingLotEntity.name = infoUpdate.name;
        parkingLotEntity.quantityVehiclesMaximum = infoUpdate.quantityVehiclesMaximum;
        parkingLotEntity.costHourVehicle = infoUpdate.costHourVehicle;
        parkingLotEntity.user = userEntity;

        const parkingLotSave: ParkingLotEntity = await (await (this.parkingLotRepository.execRepository)).save(parkingLotEntity);
        return this.parkingLotResponseMapper.toResponse(parkingLotSave);
    }

    async deleteParkingLot(id: number): Promise<void> {
        const parkingLotEntity = (await this.parkingLotRepository.findParkingLotByIdWithRelationUser(id));
        if (!parkingLotEntity) throw new ErrorException("El parqueadero no existe", 404);

        const data: DeleteResult = await (await this.parkingLotRepository.execRepository).delete(id);
        if (!data.affected) {
            throw new ErrorException("Hay un error al eliminar", 409);
        }

    }


    private async validateUser(id: number): Promise<UserEntity> {
        const userPromise = this.userRepository.findUserWithRelationRol(id);
        const user = (await userPromise);
        if (!user) throw new ErrorException("El usuario no fue encontrado", 404);
        if (Number(user.rol.id) !== this.ID_ROL_SOCIO) throw new ErrorException("El usuario debe ser de rol SOCIO.", 409);

        return user;
    }


}
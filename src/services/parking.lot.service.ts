import { ParkingLotRequestDto } from "../dto/request/parking.lot.request.dto";
import { ParkingLotResponseDto } from "../dto/response/parking.lot.response.dto";
import { UserResponseDTO } from "../dto/response/user.response.dto";
import { ParkingLotEntity } from "../entities/parking.lot.entity";
import { UserEntity } from "../entities/user.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { ParkingLotRepository } from "../repositories/parking.lot.repository";
import { UserRepository } from "../repositories/user.repository";
import { HttpResponse } from "../shared/response/http.response";
import { FechaUtils } from "../shared/util/fecha.utils";
import { UserService } from "./user.service";

export class ParkingLotService{

    private parkingLotRepository = new ParkingLotRepository();
    private userRepository= new UserRepository();
    private ID_ROL_SOCIO:number = 2;
    private fechaUtils = new FechaUtils();

    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()){}

    async saveParkingLot(body:ParkingLotRequestDto): Promise<ParkingLotResponseDto>{
        const  id:number = body.partnerId;
        const user = await this.validateUser(id);

        const newParkingLot =  (await this.parkingLotRepository.execRepository).create(body);
         newParkingLot.user= user;

        const parkingLot = await (await this.parkingLotRepository.execRepository).save(newParkingLot);
       
        return this.setearDatosParquingResponseDto(parkingLot)
    }

    async findAllParkingLots():Promise<ParkingLotResponseDto[]>{
    const parkingLotsEntity = await this.parkingLotRepository.findAllParkingLotsWithRelationUser();

        let parkingLots: ParkingLotResponseDto[] = [];

         parkingLotsEntity.map((parkingLot) =>{ 
            const parkinLotResponseDto = this.setearDatosParquingResponseDto(parkingLot)
            parkingLots.push(parkinLotResponseDto);
        })

        return parkingLots;
    }

    async findParkingLotById(id: number):Promise<ParkingLotResponseDto>{

        const parkingLotEntity = await this.parkingLotRepository.findParkingLotByIdWithRelationUser(id);
        
        if(!parkingLotEntity) throw new ErrorException("El parqueadero no existe", 404);

        return this.setearDatosParquingResponseDto(parkingLotEntity);
    }


    private async validateUser(id:number):Promise<UserEntity>{
        const userPromise=  this.userRepository.findUserWithRelationRol(id);
        const user =(await userPromise);
        if (!user) throw new ErrorException("El usuario no fue encontrado", 404);
        if(Number(user.rol.id) !== this.ID_ROL_SOCIO) throw new ErrorException("El usuario debe ser de rol SOCIO.", 409);

        return user;
    }


    private setearDatosParquingResponseDto(parkingLot: ParkingLotEntity): ParkingLotResponseDto {
        const parkingLotResponseDto: ParkingLotResponseDto = {
          id: Number(parkingLot.id),
          name: parkingLot.name,
          quantityVehiclesMaximum: parkingLot.quantityVehiclesMaximum,
          costHourVehicle: parkingLot.costHourVehicle,
          created_at: this.fechaUtils.convertirFechaUtcAColombia(parkingLot.created_at),
          partnerId: Number(parkingLot.user.id)
        
      };
      return parkingLotResponseDto;

      }

}
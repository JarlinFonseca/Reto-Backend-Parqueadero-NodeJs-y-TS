import { BaseService } from "../config/base.service";
import { ParkingLotRequestDto } from "../dto/request/parking.lot.request.dto";
import { ParkingLotResponseDto } from "../dto/response/parking.lot.response.dto";
import { UserResponseDTO } from "../dto/response/user.response.dto";
import { ParkingLotEntity } from "../entities/parking.lot.entity";
import { UserEntity } from "../entities/user.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { HttpResponse } from "../shared/response/http.response";
import { UserService } from "./user.service";

export class ParkingLotService extends BaseService<ParkingLotEntity>{

    private parkingLotRepository = this.execRepository;
    private userService= new UserService();
    private ID_ROL_SOCIO:number = 2;
    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()){
        super(ParkingLotEntity);
    }

    async saveParkingLot(body:ParkingLotRequestDto): Promise<ParkingLotResponseDto>{
        const  id:number = body.partnerId;
        const user = await this.validateUser(id);

        const newParkingLot =  (await this.parkingLotRepository).create(body);
         newParkingLot.user= user;

        const parkingLot = await (await this.parkingLotRepository).save(newParkingLot);
       
        return this.setearDatosParquingResponseDto(parkingLot)

    }

    async findAllParkingLots():Promise<ParkingLotResponseDto[]>{
    const parkingLotsEntity = await this.findAllParkingLotsWithRelationUser();

        let parkingLots: ParkingLotResponseDto[] = [];

         parkingLotsEntity.map((parkingLot) =>{ 
            const parkinLotResponseDto = this.setearDatosParquingResponseDto(parkingLot)
            parkingLots.push(parkinLotResponseDto);
        })

        return parkingLots;
    }

    private async validateUser(id:number):Promise<UserEntity>{
        const userPromise=  this.userService.findUserWithRelationRol(id);
        const user =(await userPromise);
        if (!user) throw new ErrorException("El usuario no fue encontrado", 404);
        if(Number(user.rol.id) !== this.ID_ROL_SOCIO) throw new ErrorException("El usuario debe ser de rol SOCIO.", 409);

        return user;
    }


    private setearDatosParquingResponseDto(parkingLot: ParkingLotEntity): ParkingLotResponseDto {
        console.log("Entra")
        const parkingLotResponseDto: ParkingLotResponseDto = {
          id: parkingLot.id,
          name: parkingLot.name,
          quantityVehiclesMaximum: parkingLot.quantityVehiclesMaximum,
          costHourVehicle: parkingLot.costHourVehicle,
          created_at: parkingLot.created_at,
          partnerId: parkingLot.user.id
        
      };
      return parkingLotResponseDto;

      }

      async findAllParkingLotsWithRelationUser(): Promise<ParkingLotEntity[] >{
        return (await this.parkingLotRepository)
        .createQueryBuilder('parking_lot')
        .leftJoinAndSelect('parking_lot.user', 'user')
        .getMany();
      }

}
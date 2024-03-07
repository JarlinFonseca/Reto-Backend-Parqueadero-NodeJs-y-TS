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
    //Este es el problema
    private userService:UserService= new UserService();
    private ID_ROL_SOCIO:number = 2;
    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()){
        super(ParkingLotEntity);
    }

    async saveParkingLot(body:ParkingLotRequestDto): Promise<ParkingLotResponseDto>{
        console.log("Entra funcion servicio")
       
      // const  id:number = body.user.id;

       //console.log(id);

    //    const user:UserResponseDTO | null =   await (await this.userService).findUserById( id );
    //    if (!user) {
    //     throw new ErrorException("El rol no fue encontrado", 404);
    //  }

       // console.log(user.dni);
       //if(!userEntity) throw new ErrorException("El usuario no existe", 404);
       //const userValidate = this.validateUser(userEntity);
        
        //const user =  this.validateUser(body.partnerId);
       

       // console.log(userEntity);

        

        const newParkingLot = (await this.parkingLotRepository).create(body);
        console.log(newParkingLot);
      // newParkingLot.user= userEntity;

         console.log(newParkingLot);
        const parkingFinal = this.setearDatosToParkingLotEntity(newParkingLot,  newParkingLot);

        console.log(parkingFinal);

        (await this.parkingLotRepository).save(newParkingLot);

        //console.log(this.setearDatosParquingResponseDto(parkingFinal))

        return this.setearDatosParquingResponseDto(parkingFinal)

    }

    private validateUser(user:UserEntity):UserEntity{
        if(user.rol.id !== this.ID_ROL_SOCIO) throw new ErrorException("El usuario debe ser de rol SOCIO.", 409);
        console.log(user)
        return user;
    }

    private setearDatosParquingResponseDto(parkingLot: any): ParkingLotResponseDto {
        const parkingLotResponseDto: ParkingLotResponseDto = {
          id: parkingLot.id,
          name: parkingLot.name,
          quantityVehiclesMaximum: parkingLot.quantity_vehicles_maximum,
          costHourVehicle: parkingLot.cost_hour_vehicle,
          created_at: parkingLot.created_at,
          partnerId: parkingLot.partnerId
        
      };
    
      return parkingLotResponseDto;
    
      }

      private setearDatosToParkingLotEntity(parkingLot:any, userEntity: any): ParkingLotEntity{

        const parkingEntity : ParkingLotEntity = {
            id: parkingLot.id,
            name: parkingLot.name,
            quantityVehiclesMaximum: parkingLot.quantityVehiclesMaximum,
            costHourVehicle: parkingLot.costHourVehicle,
            created_at: parkingLot.created_at,
            user: userEntity
           
        };
        return parkingEntity;

      }
}
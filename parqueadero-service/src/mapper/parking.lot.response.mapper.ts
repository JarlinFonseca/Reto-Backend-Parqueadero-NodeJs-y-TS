import { ParkingLotResponseDto } from "../dto/response/parking.lot.response.dto";
import { ParkingLotEntity } from "../entities/parking.lot.entity";
import { FechaUtils } from "../shared/util/fecha.utils";

export class ParkingLotResponseMapper {
    private fechaUtils = new FechaUtils();

     toResponse(parkingLot: ParkingLotEntity): ParkingLotResponseDto {
        const parkingLotResponseDto: ParkingLotResponseDto = {
          id: Number(parkingLot.id),
          name: parkingLot.name,
          quantityVehiclesMaximum: parkingLot.quantityVehiclesMaximum,
          costHourVehicle: parkingLot.costHourVehicle,
          createdAt: this.fechaUtils.convertirFechaUtcAColombia(parkingLot.createdAt),
          partnerId: Number(parkingLot.user.id)
        
      };
      return parkingLotResponseDto;

      }
}
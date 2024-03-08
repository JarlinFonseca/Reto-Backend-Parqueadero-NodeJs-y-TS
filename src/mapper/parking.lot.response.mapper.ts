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
          created_at: this.fechaUtils.convertirFechaUtcAColombia(parkingLot.created_at),
          partnerId: Number(parkingLot.user.id)
        
      };
      return parkingLotResponseDto;

      }
}
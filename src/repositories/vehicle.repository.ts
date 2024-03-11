import { BaseRepository } from "../config/base.repository";
import { VehicleEntity } from "../entities/vehicle.entity";

export class VehicleRepository extends BaseRepository<VehicleEntity>{

    constructor() {
      super(VehicleEntity);
    }

    async findByPlaca(placa: string): Promise<VehicleEntity | null> {
        return (await this.execRepository)
          .createQueryBuilder('vehicle')
          .where({ placa })
          .getOne();
      }
    


    


}
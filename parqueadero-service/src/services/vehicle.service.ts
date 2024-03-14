import { VehicleEntity } from "../entities/vehicle.entity";
import { ParkingLotVehicleRepositoty } from "../repositories/parking.lot.vehicle.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { HttpResponse } from "../shared/response/http.response";

export class VehicleService{

    private vehicleRepository:VehicleRepository = new VehicleRepository();
    private parkingLotVehicleRepository:ParkingLotVehicleRepositoty = new ParkingLotVehicleRepositoty();
    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }

    async saveVehicle(placa:string, vehicle:VehicleEntity | null){
        if(!vehicle){
            const newVehicle = new VehicleEntity();
            newVehicle.placa = placa;
            const vehicleNew = await (await this.vehicleRepository.execRepository).save(newVehicle);
            return vehicleNew;
        }
        return vehicle;
    }

    async getVehicleByPlaca(placa:string):Promise<VehicleEntity | null>{
        return await this.vehicleRepository.findByPlaca(placa);
    }

    async getVehicleById(id:number):Promise<VehicleEntity | null>{
        return (await this.vehicleRepository.execRepository).findOneBy({id});
    }

    async verifyExistVehicle(vehicle: VehicleEntity | null):Promise<boolean>{
        if(!vehicle) return false;
       const parkingLotVehicle = await this.parkingLotVehicleRepository.findByVehicleIdAndActiveEntryFlag(vehicle.id, true);
       return parkingLotVehicle!==null;
    }


}
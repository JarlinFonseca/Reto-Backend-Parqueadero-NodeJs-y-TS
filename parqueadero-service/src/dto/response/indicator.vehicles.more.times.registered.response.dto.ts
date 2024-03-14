import { VehicleEntity } from "../../entities/vehicle.entity";

export class IndicatorVehiclesMoreTimesRegisteredResponseDto{
    vehicle!: VehicleEntity;
    quantityTimesRegistered!: number;
    nameParkingLot!: string;

}
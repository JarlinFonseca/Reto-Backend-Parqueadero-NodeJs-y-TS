import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ParkingLotEntity } from "./parking.lot.entity";
import { VehicleEntity } from "./vehicle.entity";

@Entity({name: 'parking_lots_vehicles'})
export class ParkingLotVehicleEntity{

    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;

    @CreateDateColumn({
        name: "created_entry",
        type: "timestamp",
      })
    created_entry!: Date;

    @Column({name: 'active_entry_flag'})
    activeEntryFlag!: boolean;

    @ManyToOne(()=>ParkingLotEntity, {nullable:false})
    @JoinColumn({name: 'parking_lot_id'})
    parkingLot!: ParkingLotEntity;

    @ManyToOne(()=>VehicleEntity, {nullable:false})
    @JoinColumn({name: 'vehicle_id'})
    vehicle!: VehicleEntity;

}
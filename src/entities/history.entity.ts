import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ParkingLotVehicleEntity } from "./parking.lot.vehicles.entity";

@Entity({name: 'history'})
export class HistoryEntity{

    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;

    @Column({name: 'total_payment'})
    totalPayment!: number;

    @Column({ type: 'timestamp', name: 'entry_date' })
    entryDate!: Date;

    @Column({ type: 'timestamp', name: 'departure_date'})
    departureDate!: Date;

    @ManyToOne(()=> ParkingLotVehicleEntity, {nullable: false})
    @JoinColumn({name: 'parking_lot_vehicle_id'})
    parkingLotVehicle!: ParkingLotVehicleEntity;







}
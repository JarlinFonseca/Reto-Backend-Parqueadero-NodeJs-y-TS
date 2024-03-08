import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'parking_lots'})
export class ParkingLotEntity {

    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;

    @Column()
    name!: string;
    
    @Column({name: 'quantity_vehicles_maximum'})
    quantityVehiclesMaximum!: number;

    @Column({name: 'cost_hour_vehicle'})
    costHourVehicle!: number;

    @CreateDateColumn({
        name: "created_at ",
        type: "timestamp",
      })
    createdAt!: Date;

    @ManyToOne(()=> UserEntity, {nullable:false})
    @JoinColumn({name: 'user_id'})
    user!: UserEntity;


}
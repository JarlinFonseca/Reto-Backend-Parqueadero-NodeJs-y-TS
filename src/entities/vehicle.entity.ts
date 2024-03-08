import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'vehicles'})
export class VehicleEntity {
    
    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;

    @Column()
    placa!: string;

}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'roles'})
export class RolEntity{

    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;
    @Column()
    name!: string;
    @Column()
    description!: string;

}
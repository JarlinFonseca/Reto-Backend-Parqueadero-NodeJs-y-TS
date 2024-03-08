import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolEntity } from "./rol.entity";

@Entity({name : "users"})
export class UserEntity {

    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;

    @Column()
    name!: string;

    @Column()
    lastname!: string;

    @Column({unique: true, nullable:false})
    dni!: string;

    @Column({unique: true, nullable: false})
    email!: string;

    @Column()
    password!: string;

    @CreateDateColumn({
      name: "created_at ",
      type: "timestamp",
    })
    created_at!: Date;

    @ManyToOne(() => RolEntity, {nullable: false})
    @JoinColumn({ name: "rol_id"})
    rol!: RolEntity;




    


}
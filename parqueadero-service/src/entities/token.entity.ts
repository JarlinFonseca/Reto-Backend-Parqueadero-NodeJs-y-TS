import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TokenType } from "../enums/token.type";
import { UserEntity } from "./user.entity";

@Entity({name: 'tokens'})
export class TokenEntity{

    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number;

    @Column({name: 'token_jwt'})
    tokenJwt!: string;

    @Column({type: "enum", enum: TokenType, nullable: false,  name: 'token_type'})
    tokenType!: TokenType;

    @Column({unique: true})
    identificator!: string;

    @Column()
    revoked!: boolean;

    @ManyToOne(()=> UserEntity, {nullable:false})
    @JoinColumn({name: 'user_id'})
    user!: UserEntity;


}
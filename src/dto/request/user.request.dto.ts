import {IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, Length, Matches, Min, MinLength } from "class-validator";
import { RolEntity } from "../../entities/rol.entity";


export class UserRequestDTO  {

  @IsInt({ message: 'El campo id debe ser númerico' })
  @Min(1, { message: 'El campo id debe ser mayor que 1' })
  @IsOptional()
  id!: number;

  @IsNotEmpty({message: 'El campo name es requerido'})
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'El campo name debe contener solo letras y números.'})
  @Length(2, 50, { message: 'El campo name debe tener entre 2 y 50 caracteres.' })
  name!: string;

  @Length(2, 50, { message: 'El campo lastname debe tener entre 2 y 50 caracteres.' })
  @IsNotEmpty({message: 'El campo lastname es requerido'})
  lastname!: string;

  @Matches(/^[0-9]+$/, { message: 'El campo name debe contener números' })
  @IsNotEmpty({message: 'El campo dni es requerido'})
  dni!: string;

  @IsNotEmpty({message : 'El campo email es requerido'})
  @IsEmail({}, { message: 'El campo email debe ser una dirección de correo electrónico válida.' })
  email!: string;

  @IsNotEmpty({message: 'El campo password es requerido'})
  password!: string;

  @IsDate()
  @IsOptional()
  createdAt!: Date;

  @IsOptional()
  rol!: RolEntity;

}

export enum RoleType {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN"
}
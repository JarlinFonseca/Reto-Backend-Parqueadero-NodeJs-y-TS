import {IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export class UserRequestDTO  {

  @IsNotEmpty({message: 'El campo name es requerido'})
  @Matches(/^[a-zA-Z0-9\s]+$/, { message: 'El campo name debe contener solo letras y numeros.'})
  @Length(2, 50, { message: 'El campo name debe tener entre 2 y 50 caracteres.' })
  name!: string;

  @Length(2, 50, { message: 'El campo lastname debe tener entre 2 y 50 caracteres.' })
  @IsNotEmpty({message: 'El campo lastname es requerido'})
  lastname!: string;

  @Matches(/^\d+$/, { message: 'El campo name debe contener números' })
  @IsNotEmpty({message: 'El campo dni es requerido'})
  dni!: string;

  @IsNotEmpty({message : 'El campo email es requerido'})
  @IsEmail({}, { message: 'El campo email debe ser una dirección de correo electrónico válida.' })
  email!: string;

  @IsNotEmpty({message: 'El campo password es requerido'})
  password!: string;

}

import { IsDate, IsDefined, IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";


export class UserDTO  {

  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be greater than or equal to 1' })
  @IsOptional()
  id!: number;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  lastname!: string;

  @IsNotEmpty()
  dni!: string;

  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsDate()
  @IsOptional()
  createdAt!: Date;

}

export enum RoleType {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN"
}
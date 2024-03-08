import { IsDate, IsDefined, IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";
import { RolEntity } from "../../entities/rol.entity";


export class UserResponseDTO  {
  id!: number;
  name!: string;
  lastname!: string;
  dni!: string;
  email!: string;
  createdAt!: string;
  rol!: RolEntity;
}


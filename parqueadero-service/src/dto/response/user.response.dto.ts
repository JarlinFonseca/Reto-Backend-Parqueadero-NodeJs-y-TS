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


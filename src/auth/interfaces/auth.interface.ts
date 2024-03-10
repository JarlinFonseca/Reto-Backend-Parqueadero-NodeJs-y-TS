import { RolEntity } from "../../entities/rol.entity";

export interface PayloadToken{
    sub: string,
    id: number,
    name: string,
    rol: string
}
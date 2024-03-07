import { IsDate, IsInt, IsNotEmpty, IsOptional, Length, Matches, Min } from "class-validator";
import { UserEntity } from "../../entities/user.entity";

export class ParkingLotRequestDto{

    @IsInt({ message: 'El campo id debe ser númerico' })
    @Min(1, { message: 'El campo id debe ser mayor que 1' })
    @IsOptional()
    id!: number;

    @IsNotEmpty({message: 'El campo name es requerido'})
    //@Matches(/^[a-zA-Z0-9]+$/, { message: 'El campo name debe contener solo letras y números.'})
    @Length(2, 50, { message: 'El campo name debe tener entre 2 y 50 caracteres.' })
    name!: string;


    @IsNotEmpty({message: 'El campo quantityVehiclesMaximum es requerido'})
    @Min(1, { message: 'La cantidad de vehículos debe ser mayor a 0' })
    quantityVehiclesMaximum!: number;

    @IsNotEmpty({message: 'El campo costHourVehicle es requerido'})
    @Min(1, { message: 'La costo de la hora de los vehiculos debe ser mayor a 0' })
    costHourVehicle!: number;

    @IsDate()
    @IsOptional()
    created_at !: Date;

    @IsNotEmpty({message: 'El id del SOCIO es requerido'})
   // @Matches(/^[0-9]+$/, { message: 'El campo partnerId debe contener números' })
    @Min(1, { message: 'El campo partnerId debe ser mayor a 0' })
    partnerId!: number;

    @IsOptional()
    user!: UserEntity;

}
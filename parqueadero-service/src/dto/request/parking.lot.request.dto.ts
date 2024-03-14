import { IsNotEmpty, Length, Matches, Min } from "class-validator";

export class ParkingLotRequestDto{

    @IsNotEmpty({message: 'El campo name es requerido'})
    @Matches(/^[a-zA-Z0-9\s]+$/, { message: 'El campo name debe contener solo letras y numeros.'})
    @Length(2, 50, { message: 'El campo name debe tener entre 2 y 50 caracteres.' })
    name!: string;

    @IsNotEmpty({message: 'El campo quantityVehiclesMaximum es requerido'})
    @Min(1, { message: 'La cantidad de vehículos debe ser mayor a 0' })
    quantityVehiclesMaximum!: number;

    @IsNotEmpty({message: 'El campo costHourVehicle es requerido'})
    @Min(1, { message: 'La costo de la hora de los vehiculos debe ser mayor a 0' })
    costHourVehicle!: number;

    @IsNotEmpty({message: 'El id del SOCIO es requerido'})
    @Min(1, { message: 'El campo partnerId debe ser mayor a 0' })
    partnerId!: number;

}
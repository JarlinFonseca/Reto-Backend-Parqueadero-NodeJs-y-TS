import { IsNotEmpty, Matches } from "class-validator";

export class EntryVehicleParkingLotRequestDto{

    @Matches(/^[a-zA-Z0-9]{6}$/, { message: 'La placa debe tener 6 caracteres de longitud, alfanumérica, no se permite caracteres especiales ni la letra ñ'})
    placa!: string;

    @IsNotEmpty({message: 'El identificador del parqueadero no puede ser nulo'})
    parkingLotId!: number;


}
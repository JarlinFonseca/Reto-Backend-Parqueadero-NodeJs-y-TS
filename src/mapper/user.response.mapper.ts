import { UserResponseDTO } from "../dto/response/user.response.dto";
import { FechaUtils } from "../shared/util/fecha.utils";

export class UserResponseMapper {

    private fechaUtils = new FechaUtils();

    toResponse(user: any): UserResponseDTO {
        const userResponseDto: UserResponseDTO = {
            id: Number(user.id),
            name: user.name,
            lastname: user.lastname,
            dni: user.dni,
            email: user.email,
            createdAt: this.fechaUtils.convertirFechaUtcAColombia(user.created_at),
            rol: user.rol
        };

        return userResponseDto;

    }


}
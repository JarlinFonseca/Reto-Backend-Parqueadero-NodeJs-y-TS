import { DeleteResult, QueryFailedError, UpdateResult } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import { UserRequestDTO } from "../dto/request/user.request.dto";
import { UserResponseDTO } from "../dto/response/user.response.dto";
import { HttpResponse } from "../shared/response/http.response";
import { ErrorException } from "../exceptions/ErrorException";
import { RolService } from "./rol.service";
import { RolEntity } from "../entities/rol.entity";
import { UserRepository } from "../repositories/user.repository";
import { UserResponseMapper } from "../mapper/user.response.mapper";

export class UserService {

  private userRepository = new UserRepository();
  private rolService: RolService = new RolService();
  private userReponseMapper: UserResponseMapper = new UserResponseMapper();
  private ID_ROL_SOCIO: number = 2;


  constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) { }

  async findAllUser(): Promise<UserEntity[]> {
    return (await this.userRepository.execRepository).find();
  }

  async findUserById(id: number): Promise<UserResponseDTO | null> {
    const userEntity = await (await this.userRepository.execRepository).findOneBy({ id });

    if (!userEntity) {
      throw new ErrorException(`El usuario con ID: ${id} no existe`, 404);
    }

    return this.userReponseMapper.toResponse(userEntity);
  }


  private async validatePropertiesUnique(body: UserRequestDTO) {
    const existDni: boolean = await this.userRepository.existDni(body.dni);
    const existEmail: boolean = await this.userRepository.existEmail(body.email);

    if (existDni) {
      if (existEmail) {
        throw new ErrorException("El dni y email ya existen", 409);
      } else {
        throw new ErrorException("El dni ya existe", 409);
      }
    } else if (existEmail) {
      if (existDni) {
        throw new ErrorException("El email y dni ya existen", 409);
      } else {
        throw new ErrorException("El email ya existe", 409);
      }
    }
  }


  async savePartner(body: UserRequestDTO): Promise<UserResponseDTO> {
    const rol: RolEntity | null = await this.rolService.findRolById(this.ID_ROL_SOCIO);
    if (!rol) {
      throw new ErrorException("El rol no fue encontrado", 404);
    }
    await this.validatePropertiesUnique(body);

    const newUser = (await this.userRepository.execRepository).create(body);
    newUser.rol = rol;
    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;

    const userSave = await (await this.userRepository.execRepository).save(newUser);

    return this.userReponseMapper.toResponse(userSave);
  }



  async deleteUser(id: number): Promise<DeleteResult> {
    return (await this.userRepository.execRepository).delete({ id });
  }

  //   async updateUser(id: string, infoUpdate: UserRequestDTO): Promise<UpdateResult> {
  //     return (await this.execRepository).update(id, infoUpdate);
  //   }
}

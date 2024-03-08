import { DeleteResult, QueryFailedError, UpdateResult } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { BaseService } from "../config/base.service";
import * as bcrypt from "bcrypt";
import { UserRequestDTO } from "../dto/request/user.request.dto";
import { UserResponseDTO } from "../dto/response/user.response.dto";
import { HttpResponse } from "../shared/response/http.response";
import { ErrorException } from "../exceptions/ErrorException";
import { RolService } from "./rol.service";
import { RolEntity } from "../entities/rol.entity";

export class UserService extends BaseService<UserEntity> {

   private userRepository =  this.execRepository;
   private rolService:RolService =  new RolService(); 
   private ID_ROL_SOCIO:number = 2;
     
  constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) {
    super(UserEntity);
  }

  async findAllUser(): Promise<UserEntity[]> {
    return (await this.execRepository).find();
  }

  async findUserById(id: number): Promise<UserResponseDTO | null > {
    const userEntity = await (await this.userRepository).findOneBy({ id });

    if(!userEntity){
      throw new ErrorException(`El usuario con ID: ${id} no existe`, 404);
    }

    const userResponseDto= this.setearDatosResponseDto(userEntity);
    
    return userResponseDto;
  }

//   async findUserWithRole(
//     id: string,
//     role: RoleType
//   ): Promise<UserEntity | null> {
//     const user = (await this.execRepository)
//     .createQueryBuilder('user')
//     .where({id})
//     .andWhere({role})
//     .getOne();

//     return user;
//   }


  async findUserWithRelation(id: string): Promise<UserEntity | null>{
    return (await this.execRepository)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.customer', 'customer')
    .where({id})
    .getOne();
  }

   async findUserWithRelationRol(id: number): Promise<UserEntity | null>{
    return (await this.userRepository)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.rol', 'rol')
    .where({id})
    .getOne();
  }

  async findByEmail(email: string): Promise<UserEntity | null>{
    return (await this.execRepository)
      .createQueryBuilder('user')
      .addSelect("user.password")
      .where({email})
      .getOne();
  }

  async existDni(dni: string): Promise<boolean>{
     const user = (await this.execRepository)
      .createQueryBuilder('user')
      .where({dni})
      .getOne();
      return await user !== null;
  }

  async existEmail(email: string): Promise<boolean>{
    const user = (await this.execRepository)
     .createQueryBuilder('user')
     .where({email})
     .getOne();
    return await user !== null;
 }

  async findByUsername(username: string): Promise<UserEntity | null>{
    return (await this.execRepository)
      .createQueryBuilder('user')
      .addSelect("user.password")
      .where({username})
      .getOne();
  }

  private async validatePropertiesUnique(body: UserRequestDTO){
    const existDni:boolean = await this.existDni(body.dni);
    const existEmail:boolean = await this.existEmail(body.email);

    if(existDni){
      if(existEmail){
        throw new ErrorException("El dni y email ya existen", 409);
      }else{
        throw new ErrorException("El dni ya existe", 409);
      }
    }else if(existEmail){
      if(existDni){
        throw new ErrorException("El email y dni ya existen", 409);
      }else{
        throw new ErrorException("El email ya existe", 409);
      }
    }
  }


  async savePartner(body: UserRequestDTO): Promise<UserResponseDTO> {
    const rol:RolEntity | null  =  await this.rolService.findRolById(this.ID_ROL_SOCIO);
    if (!rol) {
      throw new ErrorException("El rol no fue encontrado", 404);
  }
    await this.validatePropertiesUnique(body);

    const newUser = (await this.userRepository).create(body);
    newUser.rol =rol;
    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;

    const userSave = await(await this.execRepository).save(newUser);

    const userResponseDto =  this.setearDatosResponseDto(userSave);

    return userResponseDto;
  }

  private setearDatosResponseDto(user: any): UserResponseDTO{
    const userResponseDto: UserResponseDTO = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      dni: user.dni,
      email: user.email,
      createdAt: user.created_at,
      rol: user.rol
  };

  return userResponseDto;

  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }

//   async updateUser(id: string, infoUpdate: UserRequestDTO): Promise<UpdateResult> {
//     return (await this.execRepository).update(id, infoUpdate);
//   }
}

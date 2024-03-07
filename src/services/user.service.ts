import { DeleteResult, QueryFailedError, UpdateResult } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { BaseService } from "../config/base.service";
import * as bcrypt from "bcrypt";
import { UserDTO } from "../dto/user.dto";
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

    const userResponseDto: UserResponseDTO = {
        id: userEntity.id,
        name: userEntity.name,
        lastname: userEntity.lastname,
        dni: userEntity.dni,
        email: userEntity.email,
        createdAt: userEntity.created_at,
        rol: userEntity.rol
    };
    
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

  async findByEmail(email: string): Promise<UserEntity | null>{
    return (await this.execRepository)
      .createQueryBuilder('user')
      .addSelect("user.password")
      .where({email})
      .getOne();
  }

  async findByUsername(username: string): Promise<UserEntity | null>{
    return (await this.execRepository)
      .createQueryBuilder('user')
      .addSelect("user.password")
      .where({username})
      .getOne();
  }


  async createUser(body: UserDTO): Promise<UserResponseDTO> {
    //const rolId = this.rolService.findRolById(this.ID_ROL_SOCIO);
  //  if(Number(rolId) !== this.ID_ROL_SOCIO){
    //      throw new ErrorException("El id de rol no es de SOCIO ", 409);
    //}

    const rol:RolEntity | null  =  await this.rolService.findRolById(this.ID_ROL_SOCIO);
    if (rol === null) {
      throw new ErrorException("El rol no fue encontrado", 404);
  }


    const newUser = (await this.userRepository).create(body);
    newUser.rol =rol;
    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;

    try{
      const userEntity = (await this.execRepository).save(newUser);

    }catch(error){
      
      if (error instanceof QueryFailedError) {
        console.error("Error de llave duplicada:", error.message);
        // Manejar el error de llave duplicada, por ejemplo, lanzando una excepción personalizada o respondiendo con un mensaje de error al cliente
    } else {
        // Manejar otros tipos de errores
        console.error("Error general:", error);
    }
    //  throw new ErrorException("No se guardo el socio", 409);
    }
   


    const userResponseDto: UserResponseDTO = {
      id: newUser.id,
      name: newUser.name,
      lastname: newUser.lastname,
      dni: newUser.dni,
      email: newUser.email,
      createdAt: newUser.created_at,
      rol: newUser.rol
  };
  
    return userResponseDto;
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }

//   async updateUser(id: string, infoUpdate: UserDTO): Promise<UpdateResult> {
//     return (await this.execRepository).update(id, infoUpdate);
//   }
}

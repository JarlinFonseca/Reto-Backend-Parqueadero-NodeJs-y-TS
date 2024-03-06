import { DeleteResult, UpdateResult } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { BaseService } from "../config/base.service";
import { UserDTO } from "../dto/user.dto";
import { UserResponseDTO } from "../dto/response/user.response.dto";
import { NotFoundException } from "../exceptions/NotFoundException";
import { HttpResponse } from "../shared/response/http.response";

export class UserService extends BaseService<UserEntity> {

  private userRepository =  this.execRepository;
     
  constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) {
    super(UserEntity);
  }

  async findAllUser(): Promise<UserEntity[]> {
    return (await this.execRepository).find();
  }
  async findUserById(id: number): Promise<UserResponseDTO | null > {
    const userRepository = await this.execRepository;

    const userEntity = await (await this.userRepository).findOneBy({ id });
    //const userEntity = await userRepository.findOneBy({ id });
    if(!userEntity){
      return null;
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


  async createUser(body: UserDTO): Promise<UserEntity> {
    const newUser = (await this.execRepository).create(body);
    //const hash = await bcrypt.hash(newUser.password, 10);
    //newUser.password = hash;
    return (await this.execRepository).save(newUser);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }

//   async updateUser(id: string, infoUpdate: UserDTO): Promise<UpdateResult> {
//     return (await this.execRepository).update(id, infoUpdate);
//   }
}

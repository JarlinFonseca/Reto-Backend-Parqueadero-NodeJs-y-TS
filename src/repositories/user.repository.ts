import { BaseRepository } from "../config/base.repository";
import { UserEntity } from "../entities/user.entity";


export class UserRepository extends BaseRepository<UserEntity>{

    constructor() {
        super(UserEntity);
      }

      async findUserWithRelationRol(id: number): Promise<UserEntity | null>{
        return (await this.execRepository)
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



}
import { BaseRepository } from "../config/base.repository";
import { RolEntity } from "../entities/rol.entity";
import { UserEntity } from "../entities/user.entity";
import { promises as fs } from 'fs';
import * as path from 'path';


export class UserRepository extends BaseRepository<UserEntity>{

  constructor() {
    super(UserEntity);
  }

  async findUserWithRelationRol(id: number): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rol', 'rol')
      .where({ id })
      .getOne();
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder('user')
      .addSelect("user.password")
      .where({ username })
      .getOne();
  }


  async findByEmail(email: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder('user')
      .addSelect("user.password")
      .where({ email })
      .getOne();
  }

  async existDni(dni: string): Promise<boolean> {
    const user = (await this.execRepository)
      .createQueryBuilder('user')
      .where({ dni })
      .getOne();
    return await user !== null;
  }

  async existEmail(email: string): Promise<boolean> {
    const user = (await this.execRepository)
      .createQueryBuilder('user')
      .where({ email })
      .getOne();
    return await user !== null;
  }

  async getStringQueriesSQL(): Promise<string> {
    const scriptPath = path.join(__dirname, '..', '..', 'src','shared', 'sql', 'import.sql');

    // Lee el contenido del archivo
    const scriptContent = await fs.readFile(scriptPath, 'utf-8');

      
    // Split the content into individual queries based on semicolons
    const queries = scriptContent.split(';');

    // Filter out empty queries
    const validQueries = queries.filter((query) => query.trim() !== '');

    // Format the queries into a multiline string with leading newline characters and indentation
    const formattedQueries = validQueries.map((query) => `\n     ${query.trim()};`).join('\n');

    // Create the final query string
    const finalQuery = `\n${formattedQueries}\n`;

    // Log or use the finalQuery as needed
    console.log('Formatted Query:', finalQuery);

  //  const query = `
  //    INSERT INTO roles(name, description) VALUES('ADMIN', 'Rol de ADMIN');
  //    INSERT INTO roles(name, description) VALUES('SOCIO', 'Rol de SOCIO');
  //    INSERT INTO users(name, lastname, dni, email, password, created_at, rol_id) VALUES ('Admin','Admin', '545454454', 'admin@mail.com', '$2a$10$z7Rr9.jvu2dp1.DWbrQLU.ZHFWolOARlRgfC8WnWDl0uohqG72lR2', current_timestamp, 1)
  //  `;
      //console.log(query)

      return finalQuery;


      //(await this.execRepository).query(finalQuery);

      
  }



  // async findUserWithRole(
  //   id: number,
  //   rol: RolEntity
  // ): Promise<UserEntity | null> {
  //   const user = (await this.execRepository)
  //     .createQueryBuilder('user')
  //     .where({ id })
  //     .andWhere({ rol })
  //     .getOne();

  //   return user;
  // }



}
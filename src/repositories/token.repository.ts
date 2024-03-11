
import { BaseRepository } from "../config/base.repository";
import { TokenEntity } from "../entities/token.entity";

export class TokenRepository extends BaseRepository<TokenEntity>{

    constructor() {
        super(TokenEntity);
      }


      async  findAllValidTokensByUser(userId: number): Promise<TokenEntity[]> {
        const entityManager = (await this.execRepository)
        const query = `
            SELECT t.*
            FROM tokens t
            JOIN users u ON (t.user_id=u.id)
            WHERE u.id = $1 AND t.revoked = false
        `;
        const tokens = await entityManager.query(query, [userId]);
        return tokens;
    }
    

    public async findByTokenJwt(tokenJwt:string):Promise<TokenEntity | null >{

        let token = (await this.execRepository).findOne({ where: { tokenJwt } })

        return token;

    }

    public async getTokenByIdentificator(identificator: string): Promise<TokenEntity | null> {
        const token = (await this.execRepository).
          createQueryBuilder('token')
          .where('token.identificator = :identificator', { identificator })
          .getOne();
      
        return token;
      }


      async deleteTokenById(id: number): Promise<void> {
        (await this.execRepository).delete(id);
      }

    
    


}
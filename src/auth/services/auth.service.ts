import { ConfigServer } from "../../config/config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";
import { PayloadToken } from "../interfaces/auth.interface";
import { TokenRepository } from "../../repositories/token.repository";
import { TokenType } from "../../enums/token.type";
import { TokenEntity } from "../../entities/token.entity";

export class AuthService extends ConfigServer {

    constructor(
        private readonly userRepository: UserRepository = new UserRepository(),
        protected readonly tokenRepository: TokenRepository = new TokenRepository(),
        private readonly jwtInstance = jwt
    ) {
        super();
    }

    public async validateUser(
        username: string,
        password: string
    ): Promise<UserEntity | null> {
        const userByEmail = await this.userRepository.findByEmail(username);
        console.log("validateUser en AuthService")

        if (userByEmail) {
            const isMatch = await bcrypt.compare(password, userByEmail.password);
            if (isMatch) {
                return userByEmail;
            }
        }

        return null;
    }

    //JWT_SECRET

    sing(payload: jwt.JwtPayload, secret: any) {
        return this.jwtInstance.sign(payload, secret, { expiresIn: "6h" });
    }

    public async generateJWT(
        user: UserEntity
    ): Promise<{ message: string; accessToken: string; }> {
        console.log("Generate JWT en AuthService")
        const userConsult = await this.userRepository.findUserWithRelationRol(
            user.id

        );

        const payload: PayloadToken = {
            sub: userConsult!.email,
            id: userConsult!.id,
            name: userConsult!.name,
            rol: userConsult!.rol.name,
            identificator: this.sing({
                email: userConsult!.email,
                id: userConsult!.id,
                name: userConsult!.name, 
                rol: userConsult!.rol
            }, this.getEnvironment("JWT_SECRET")),
        };

        if (userConsult) {
            user.password = "Not permission";
        }

        return {
            message: 'Usuario logueado exitosamente',
            accessToken: this.sing(payload, this.getEnvironment("JWT_SECRET")),
        };
    }

    public async saveTokenUser(user: UserEntity, tokenJwt: string, identificator: string): Promise<void> {

        const token = (await this.tokenRepository.execRepository).create({
            user: user,
            tokenJwt: tokenJwt,
            tokenType: TokenType.BEARER,
            identificator: identificator,
            revoked: false,
        });

        (await this.tokenRepository.execRepository).save(token);

    }

    public async revokeAllUserTokens(user: UserEntity): Promise<void> {
        let validUserTokens = (await this.tokenRepository.findAllValidTokensByUser(user.id));

        if (validUserTokens.length == 0) return;

        validUserTokens.forEach(token => {
            token.revoked = true;
        });

        (await this.tokenRepository.execRepository).save(validUserTokens);

    }

    public async findByTokenJwt(tokenJwt: string): Promise<TokenEntity | null> {
        return (this.tokenRepository).findByTokenJwt(tokenJwt);
    }


    public async getTokenByIdentificator(identificator: string): Promise<TokenEntity | null> {
        return (this.tokenRepository).getTokenByIdentificator(identificator);
    }

    public async deleteTokenJwtById(id:number):Promise<void>{
        (this.tokenRepository).deleteTokenById(id);
    }


}
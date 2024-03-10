import { ConfigServer } from "../../config/config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";
import { PayloadToken } from "../interfaces/auth.interface";

export class AuthService extends ConfigServer{

    constructor(
        private readonly userRepository: UserRepository = new UserRepository(),
        private readonly jwtInstance = jwt
        ){
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
        };

        if (userConsult) {
            user.password = "Not permission";
        }

        return {
            message: 'Usuario logueado exitosamente',
            accessToken: this.sing(payload, this.getEnvironment("JWT_SECRET")),
        };
    }




}
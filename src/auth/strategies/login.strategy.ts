
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { AuthService } from "../services/auth.service";
import { PassportUse } from "../utils/passport.use";
import { UserEntity } from "../../entities/user.entity";

const authService: AuthService = new AuthService();

export class LoginStrategy {
    async validate(
        username: string,
        password: string,
        done: any
    ): Promise<UserEntity> {
        const user = await authService.validateUser(username, password);
        console.log("Entra en login strategy")

        if (!user) {
            return done(null, false, { message: 'Las credenciales son incorrectas'});
        }

        return done(null, user);
    }

    get use() {
        return PassportUse<LocalStrategy, Object, VerifyFunction>(
            "login", LocalStrategy, {
            usernameField: "email",
            passwordField: "password"
        }, this.validate
        )
    }
}
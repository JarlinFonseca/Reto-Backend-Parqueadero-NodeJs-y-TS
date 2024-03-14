import { AuthService } from "../services/auth.service";
import { Strategy as JwtStr, StrategyOptions, ExtractJwt } from "passport-jwt";
import { PayloadToken } from "../interfaces/auth.interface";
import { PassportUse } from "../utils/passport.use";

const authService: AuthService = new AuthService();

export class JwtStrategy extends AuthService {

  async validate(payload: PayloadToken, done: any) {
    let token = await authService.getTokenByIdentificator(payload.identificator);

    if (!token) {
      return done(null, false, { message: 'Token no encontrado o revocado' }); // Token no encontrado o revocado
    }

    if (token.revoked) {
      // Si el usuario ingresa un token revocado se elimina de la BD (funcion q se podria activar)
      //await authService.deleteTokenJwtById(token.id);
      return done(null, false, { message: 'El token ha sido revocado', status: 403 }); // Token no encontrado o revocado
    }

    return done(null, payload);
  }

  get use() {
    return PassportUse<
      JwtStr,
      StrategyOptions,
      (payload: PayloadToken, done: any) => Promise<PayloadToken>
    >(
      "jwt",
      JwtStr,
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.getEnvironment("JWT_SECRET"),
        ignoreExpiration: false,
      },
      this.validate
    );
  }


}

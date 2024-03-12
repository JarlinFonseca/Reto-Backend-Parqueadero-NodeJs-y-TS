import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../entities/user.entity";
import { ErrorException } from "../../exceptions/ErrorException";
import jwt from 'jsonwebtoken';
import { PayloadToken } from "../interfaces/auth.interface";

export class AuthController extends AuthService {
  constructor(
    private readonly httpResponse: HttpResponse = new HttpResponse(),
  ) {
    super();
  }

  login(req: Request, res: Response, next: NextFunction) {
    const userEncode = req.user as UserEntity;

    this.generateJWT(userEncode)
      .then((encode) => {
        if (!encode) {
          return this.httpResponse.Unauthorized(res, "No tienes permisos");
        }

        const decodedToken = jwt.decode(encode.accessToken) as PayloadToken;

        this.revokeAllUserTokens(userEncode);
        this.saveTokenUser(userEncode, encode.accessToken, decodedToken.identificator);

        res.header("Content-Type", "application/json");
        res.cookie("accessToken", encode.accessToken, { maxAge: 60000 * 60 });
        res.json(encode); // Retorna el encode
      })
      .catch((err) => {
        next(err);
      });
  }


  logout(req: Request, res: Response, next: NextFunction) {
    const tokenJwt = req.headers.authorization?.replace('Bearer', '').trim();

    if (!tokenJwt) {
      throw new ErrorException("Token JWT no proporcionado", 409);
    }

    this.findByTokenJwt(tokenJwt)
      .then(async (token) => {
        if (!token) {
          throw new ErrorException("Token JWT no encontrado en la base de datos", 404);
        }

        // Invalidar el token estableciendo revoked a true
        token.revoked = true;
        return (await this.tokenRepository.execRepository).save(token);
      })
      .then(() => {
        res.status(200).json({ message: 'Token JWT revocado exitosamente' });
      })
      .catch((err) => {
        next(err);
      });
  }
}
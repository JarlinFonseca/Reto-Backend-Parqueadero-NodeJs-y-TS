import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../entities/user.entity";
import { TokenRepository } from "../../repositories/token.repository";
import { UserRepository } from "../../repositories/user.repository";
import { ErrorException } from "../../exceptions/ErrorException";
import jwt from 'jsonwebtoken';
import { PayloadToken } from "../interfaces/auth.interface";

export class AuthController extends AuthService {
  constructor(
    private readonly httpResponse: HttpResponse = new HttpResponse(),
  ) {
    super();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userEncode = req.user as UserEntity;

      const encode = await this.generateJWT(userEncode);

      console.log("Entra en login del AuthController")
      if (!encode) {
        return this.httpResponse.Unauthorized(res, "No tienes permisos");
      }

      const decodedToken = jwt.decode(encode.accessToken) as PayloadToken;
      
      this.revokeAllUserTokens(userEncode);
      this.saveTokenUser(userEncode, encode.accessToken, decodedToken.identificator);

      res.header("Content-Type", "application/json");
      res.cookie("accessToken", encode.accessToken, { maxAge: 60000 * 60 });
      res.json(encode); // Retorna el encode
    } catch (err) {
      next(err);
    }
  }


  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenJwt = req.headers.authorization?.replace('Bearer', '').trim();
      if (!tokenJwt) {
        throw new ErrorException("Token JWT no proporcionado", 409);
      }

      const token = await this.findByTokenJwt(tokenJwt);
      if (!token) {
        throw new ErrorException("Token JWT no encontrado en la base de datos", 404);
      }

      // Invalidar el token estableciendo revoked a true
      token.revoked = true;
      (await this.tokenRepository.execRepository).save(token);
       

      return res.status(200).json({ message: 'Token JWT revocado exitosamente' });
    } catch (err) {
      next(err);
    }
  }
}
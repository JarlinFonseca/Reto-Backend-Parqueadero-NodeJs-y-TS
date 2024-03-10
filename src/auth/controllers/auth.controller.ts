import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../entities/user.entity";

export class AuthController extends AuthService {
  constructor(
    private readonly httpResponse: HttpResponse = new HttpResponse()
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

      res.header("Content-Type", "application/json");
      res.cookie("accessToken", encode.accessToken, { maxAge: 60000 * 60 });
    //  res.write(JSON.stringify(encode));
    //  res.end();
      res.json(encode); // Retorna tanto el encode
    } catch (err) {
      // console.error(err);
      //return this.httpResponse.Error(res, err);
      next(err);
    }
  }
}
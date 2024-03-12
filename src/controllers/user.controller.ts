import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { DeleteResult } from "typeorm";
import { HttpResponse } from "../shared/response/http.response";

export class UserController {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()) { }

  getUsers(req: Request, res: Response, next: NextFunction) {
    this.userService.findAllUser()
      .then((data) => {
        return this.httpResponse.Ok(res, data)
      }).catch((err) => {
        next(err);
      });
  }

  getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    this.userService.findUserById(Number(id))
      .then((data) => { return this.httpResponse.Ok(res, data) })
      .catch((err) => { next(err) });
  }


  savePartner(req: Request, res: Response, next: NextFunction) {
    this.userService.savePartner(req.body)
      .then((data) => { return this.httpResponse.Created(res, data) })
      .catch((err) => { next(err) });
  }

  //   async updateUser(req: Request, res: Response) {
  //     const { id } = req.params;
  //     try {
  //       const data: UpdateResult = await this.userService.updateUser(id, req.body);

  //       if(!data.affected){
  //         return this.httpResponse.NotFound(res, "Hay un error en actualizar");
  //       }
  //       return this.httpResponse.Ok(res, data)
  //     } catch (e) {
  //       return this.httpResponse.Error(res,e);
  //     }
  //   }

  deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    this.userService.deleteUser(Number(id))
      .then((data:DeleteResult) => {
        if (!data.affected) {
          return this.httpResponse.NotFound(res, "Hay un error en eliminar");
        }
        return this.httpResponse.Ok(res, data)
      })
      .catch((err) => { next(err) });
  }

  executeScript(req: Request, res: Response, next: NextFunction) {
    this.userService.executeScript()
      .then((data) => { return this.httpResponse.Ok(res, data) })
      .catch((err) => { next(err) });
  }
}

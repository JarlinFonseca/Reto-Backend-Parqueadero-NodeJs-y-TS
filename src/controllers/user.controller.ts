import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { DeleteResult, UpdateResult } from "typeorm";
import { HttpResponse } from "../shared/response/http.response";
import { ErrorException } from "../exceptions/ErrorException";

export class UserController {
  constructor(
    private readonly userService: UserService = new UserService(), 
    private readonly httpResponse: HttpResponse = new HttpResponse()) {}

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.findAllUser();
      return this.httpResponse.Ok(res, data)
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try{
      const data = await this.userService.findUserById(Number(id));
      return this.httpResponse.Ok(res, data)
    } catch (e) {
        next(e);
      }
     
    
  }

  async getUserWithRelationById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.userService.findUserWithRelation(id);
      return this.httpResponse.Ok(res, data)
      if(!data){
        return this.httpResponse.NotFound(res, "No existe dato");
      }
    } catch (e) {
      return this.httpResponse.Error(res,e);
    }
  }

  async savePartner(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.savePartner(req.body);
      return this.httpResponse.Created(res, data)
    } catch (e) {
      next(e);
    }
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

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.userService.deleteUser(Number(id));

      if(!data.affected){
        return this.httpResponse.NotFound(res, "Hay un error en eliminar");
      }
      
      return this.httpResponse.Ok(res, data)
    } catch (e) {
      return this.httpResponse.Error(res,e);
    }
  }
}

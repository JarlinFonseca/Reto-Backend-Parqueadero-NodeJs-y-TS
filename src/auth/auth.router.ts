import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { BaseRouter } from "../shared/router/router";
import { AuthController } from "./controllers/auth.controller";

export class AuthRouter extends BaseRouter<AuthController, SharedMiddleware>{
    constructor(){
        super(AuthController, SharedMiddleware);
    }

    routes(): void{
        this.router.post("/auth/login",
        (req, res, next) =>  this.middleware.passAuth("login", req, res, next), 
        (req, res, next) =>  this.controller.login(req, res, next))
    }
}
import { UserController } from "../controllers/user.controller";
import { UserMiddleware } from "../middlewares/user.middleware";
import { BaseRouter } from "../shared/router/router";

;
export class UserRouter extends BaseRouter<UserController, UserMiddleware> {
  constructor() {
    super(UserController, UserMiddleware);
  }

  routes(): void {

    this.router.get("/users", (req, res, next) =>
      this.controller.getUsers(req, res, next)
    );

    this.router.get(
      "/users/:id",
      (req, res, next) => this.controller.getUserById(req, res, next)
    );

    this.router.get(
      "/users/user-customer/:id",
      (req, res) => this.controller.getUserWithRelationById(req, res)
    );

    this.router.post(
      "/users/partners",
      (req, res, next) => [this.middleware.userValidator(req, res, next)],
      (req, res, next) => this.controller.createUser(req, res, next)
    );
    
    // this.router.put(
    //   "/users/update/:id",
    //   this.middleware.passAuth("jwt"),
    //   (req, res, next) => [this.middleware.checkAdminRole(req, res, next)],
    //   (req, res) => this.controller.updateUser(req, res)
    // );

    this.router.delete(
      "/deleteUser/:id",
      (req, res) => this.controller.deleteUser(req, res)
    );
  }
}

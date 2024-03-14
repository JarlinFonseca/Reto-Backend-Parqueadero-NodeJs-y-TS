import { MessageController } from "../controllers/message.controller";
import { MessageMiddleware } from "../middlewares/message.middleware";
import { BaseRouter } from "../shared/router/router";
import { messageSchema} from "../validators/message.schema"

export class MessageRouter extends BaseRouter<MessageController, MessageMiddleware>{

    constructor(){
        super(MessageController, MessageMiddleware);
    }

    routes(): void{
        this.router.post(
            "/correos",
            (req, res, next) => this.middleware.messageValidator(req, res, next,messageSchema),
            (req, res, next) => this.controller.saveMessage(req, res, next)
          );

          this.router.get(
            "/correos",
            //(req, res, next) => this.middleware.messageValidator(req, res, next,messageSchema),
            (req, res, next) => this.controller.geFilteredEmails(req, res, next)
          );




    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouter = void 0;
const message_controller_1 = require("../controllers/message.controller");
const message_middleware_1 = require("../middlewares/message.middleware");
const router_1 = require("../shared/router/router");
const message_schema_1 = require("../validators/message.schema");
class MessageRouter extends router_1.BaseRouter {
    constructor() {
        super(message_controller_1.MessageController, message_middleware_1.MessageMiddleware);
    }
    routes() {
        this.router.post("/correos", (req, res, next) => this.middleware.messageValidator(req, res, next, message_schema_1.messageSchema), (req, res, next) => this.controller.saveMessage(req, res, next));
        this.router.get("/correos", 
        //(req, res, next) => this.middleware.messageValidator(req, res, next,messageSchema),
        (req, res, next) => this.controller.geFilteredEmails(req, res, next));
    }
}
exports.MessageRouter = MessageRouter;

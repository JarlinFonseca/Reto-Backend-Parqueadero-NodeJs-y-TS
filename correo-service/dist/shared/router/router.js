"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
class BaseRouter {
    router;
    controller;
    middleware;
    constructor(TController, UMiddleware) {
        this.router = (0, express_1.Router)();
        this.controller = new TController();
        this.middleware = new UMiddleware();
        this.routes();
    }
    routes() { }
}
exports.BaseRouter = BaseRouter;

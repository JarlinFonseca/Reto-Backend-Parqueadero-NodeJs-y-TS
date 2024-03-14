"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menssageSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    placa: { type: String, required: true },
    description: { type: String, required: true },
    parkingLotName: { type: String },
    dateSent: { type: Date, default: Date.now }
});
const Message = mongoose_1.default.model('Message', menssageSchema);
module.exports = Message;

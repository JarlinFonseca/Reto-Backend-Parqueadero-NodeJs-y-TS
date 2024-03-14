"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.messageSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'El correo electrónico debe tener un formato válido',
        'string.empty': 'El correo electrónico es requerido'
    }),
    placa: joi_1.default.string().required().pattern(/^[a-zA-Z0-9]{6}$/)
        .messages({
        'string.empty': 'La placa es requerida',
        'string.pattern.base': 'La placa debe tener 6 caracteres de longitud, alfanumérica, no se permite caracteres especiales ni la letra ñ'
    }),
    description: joi_1.default.string().required().messages({
        'string.empty': 'La descripción es requerida'
    }),
    parkingLotName: joi_1.default.string().required().messages({
        'string.empty': 'El nombre del parqueadero es requerido'
    })
});

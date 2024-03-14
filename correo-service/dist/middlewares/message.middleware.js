"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMiddleware = void 0;
const message_request_dto_1 = require("../dtos/request/message.request.dto");
const validate_utils_1 = require("../shared/util/validate.utils");
class MessageMiddleware {
    validateUtils = new validate_utils_1.ValidateUtils();
    messageValidator(req, res, next, schema) {
        const { email, placa, description, parkingLotName } = req.body;
        const valid = new message_request_dto_1.MessageRequestDto();
        valid.email = email;
        valid.placa = placa;
        valid.description = description;
        valid.parkingLotName = parkingLotName;
        this.validateUtils.validateFields(schema, valid, res, next);
    }
}
exports.MessageMiddleware = MessageMiddleware;

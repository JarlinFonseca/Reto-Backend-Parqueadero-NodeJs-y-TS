"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUtils = void 0;
class ValidateUtils {
    async validateFields(schema, valid, res, next) {
        const { error } = schema.validate(valid, {
            abortEarly: false
        });
        if (error) {
            const allErrors = {};
            error.details.forEach((validationError) => {
                const propertyName = validationError.path.join('_');
                const message = validationError.message;
                allErrors[propertyName] = message;
            });
            console.error(allErrors);
            return res.status(400).json(allErrors);
        }
        next();
    }
}
exports.ValidateUtils = ValidateUtils;

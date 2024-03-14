import Joi from 'joi'

export const messageSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico debe tener un formato válido',
    'string.empty': 'El correo electrónico es requerido'
  }),
  placa: Joi.string().required().pattern(/^[a-zA-Z0-9]{6}$/)
  .messages({
    'string.empty': 'La placa es requerida',
    'string.pattern.base': 'La placa debe tener 6 caracteres de longitud, alfanumérica, no se permite caracteres especiales ni la letra ñ'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'La descripción es requerida'
  }),
  parkingLotName: Joi.string().required().messages({
    'string.empty': 'El nombre del parqueadero es requerido'
  })
});

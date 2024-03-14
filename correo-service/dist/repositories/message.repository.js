"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const message_model_1 = require("../models/message.model");
const fecha_utils_1 = require("../shared/util/fecha.utils");
class MessageRepository {
    fechaUtils = new fecha_utils_1.FechaUtils();
    async saveMessage(messageRequestDto) {
        try {
            // Crea una instancia del modelo con los datos proporcionados
            const message = new message_model_1.Message({
                email: messageRequestDto.email,
                placa: messageRequestDto.placa,
                description: messageRequestDto.description,
                parkingLotName: messageRequestDto.parkingLotName,
                dateSent: this.fechaUtils.fechaActualColombia()
            });
            // Guarda el mensaje en la base de datos
            await message.save();
            console.log('Mensaje guardado correctamente');
        }
        catch (error) {
            console.error('Error al guardar el mensaje:', error);
            throw error;
        }
    }
    async findAllMails() {
        try {
            const messagesMails = await message_model_1.Message.find({});
            return messagesMails;
        }
        catch (err) {
            console.error('Error al obtener correos:', err);
            throw err;
        }
    }
    async getEmailsBetweenDates(startDate, endDate) {
        try {
            // Construye el objeto de filtro para las fechas
            //   const filtro = {
            //     dateSent: { $gte: startDate, $lte: endDate }
            //   };
            const filtro = {};
            if (startDate && endDate) {
                filtro.dateSent = { $gte: startDate, $lte: endDate };
            }
            // Ejecuta la consulta utilizando el modelo y el objeto de filtro
            const mensajes = await message_model_1.Message.find(filtro);
            return mensajes;
        }
        catch (error) {
            console.error('Error al obtener mensajes entre fechas:', error);
            throw error;
        }
    }
}
exports.MessageRepository = MessageRepository;

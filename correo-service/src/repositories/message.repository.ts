import { MessageRequestDto } from '../dtos/request/message.request.dto';
import { Message } from '../models/message.model'
import { FechaUtils } from '../shared/util/fecha.utils';

export class MessageRepository {

    private fechaUtils: FechaUtils = new FechaUtils();

    async saveMessage(messageRequestDto: MessageRequestDto): Promise<void> {
        try {
            // Crea una instancia del modelo con los datos proporcionados
            const message = new Message({
                email: messageRequestDto.email,
                placa: messageRequestDto.placa,
                description: messageRequestDto.description,
                parkingLotName: messageRequestDto.parkingLotName,
                dateSent: this.fechaUtils.fechaActualColombia()
            });

            // Guarda el mensaje en la base de datos
            await message.save();

            console.log('Mensaje guardado correctamente');
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
            throw error;
        }
    }

    async findAllMails() {
        try {
            const messagesMails = await Message.find({});
            return messagesMails;
        } catch (err) {
            console.error('Error al obtener correos:', err);
            throw err;

        }
    }


    async getEmailsBetweenDates(startDate: Date, endDate: Date) {
        try {
            // Construye el objeto de filtro para las fechas
            //   const filtro = {
            //     dateSent: { $gte: startDate, $lte: endDate }
            //   };

            const filtro: Filtro = {};
            if (startDate && endDate) {
                filtro.dateSent = { $gte: startDate, $lte: endDate };
            } 

            // Ejecuta la consulta utilizando el modelo y el objeto de filtro
            const mensajes = await Message.find(filtro);

            return mensajes;
        } catch (error) {
            console.error('Error al obtener mensajes entre fechas:', error);
            throw error;
        }
    }


}

interface Filtro {
    dateSent?: { $gte?: Date; $lte?: Date };
}
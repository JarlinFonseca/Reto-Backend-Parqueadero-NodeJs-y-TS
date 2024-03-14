import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  email: string;
  placa: string;
  description: string;
  parkingLotName: string;
  dateSent: Date;
}

const messageSchema = new Schema({
  email: { type: String, required: true },
  placa: { type: String, required: true },
  description: { type: String, required: true },
  parkingLotName: { type: String },
  dateSent: { type: Date, default: Date.now }
});
  
export const Message = mongoose.model<IMessage>('Message', messageSchema);
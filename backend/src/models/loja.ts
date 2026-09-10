import mongoose, { Schema, type Document } from 'mongoose';

// 1. Tipagem Forte (Interface)
export interface ILoja extends Document {
  nome: string;
  categoria: string;
  descricao: string;
  whatsapp: string;
  feira: mongoose.Types.ObjectId; // Referência direta (Relacionamento)
}

// 2. Schema do Mongoose
const LojaSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
    categoria: { type: String, required: true },
    descricao: { type: String, required: true },
    whatsapp: { type: String, required: true },
    feira: { type: Schema.Types.ObjectId, ref: 'Feira', required: true } // OCP: Referenciando a Feira sem acoplar a classe
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<ILoja>('Loja', LojaSchema);

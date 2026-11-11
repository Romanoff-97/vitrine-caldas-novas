import mongoose, { Schema, type Document } from 'mongoose';

// 1. Tipagem Forte (Interface)
export interface IProdutoFoto {
  url: string;
  publicId: string;
}

export interface IItinerarioParada {
  dias: number[];
  local: string;
  horario: string;
  mapsUrl?: string;
}

export interface ILoja extends Document {
  nome: string;
  categoria: string;
  descricao: string;
  whatsapp: string;
  imagemUrl?: string;
  horarioFuncionamento?: string;
  instagram?: string;
  exibirDelivery?: boolean;
  delivery?: boolean;
  itinerario?: IItinerarioParada[];
  galeria?: IProdutoFoto[];
  diasFuncionamento: number[];
  feira: mongoose.Types.ObjectId; // Referência direta (Relacionamento)
}

// 2. Schema do Mongoose
const LojaSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
    categoria: { type: String, required: true },
    descricao: { type: String, required: true },
    whatsapp: { type: String, required: true },
    imagemUrl: { type: String, required: false },
    horarioFuncionamento: { type: String, required: false },
    instagram: { type: String, required: false },
    exibirDelivery: { type: Boolean, default: false },
    delivery: { type: Boolean, default: false },
    itinerario: [
      {
        dias: { type: [Number], required: true },
        local: { type: String, required: true },
        horario: { type: String, required: true },
        mapsUrl: { type: String, required: false }
      }
    ],
    galeria: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],
    diasFuncionamento: { type: [Number], required: true },
    feira: { type: Schema.Types.ObjectId, ref: 'Feira', required: true } // OCP: Referenciando a Feira sem acoplar a classe
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<ILoja>('Loja', LojaSchema);

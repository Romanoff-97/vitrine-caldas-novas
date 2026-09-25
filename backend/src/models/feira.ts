import mongoose, { Schema, type Document } from 'mongoose';

// 1. Tipagem Forte (Interface)
export interface IFeira extends Document {
  nome: string;
  diasFuncionamento: number[];
  localizacao: string;
  mapsUrl?: string;
  ativo: boolean;
}

// 2. Schema do Mongoose (Regras do Banco de Dados)
const FeiraSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
    // Array de números representando os dias da semana (0=Dom a 6=Sáb)
    diasFuncionamento: { type: [Number], required: true },
    localizacao: { type: String, required: true },
    mapsUrl: { type: String, required: false },
    ativo: { type: Boolean, default: true }
  },
  {
    timestamps: true // Cria automaticamente createdAt e updatedAt
  }
);

export default mongoose.model<IFeira>('Feira', FeiraSchema);

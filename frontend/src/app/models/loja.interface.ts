import { Feira } from './feira.interface';

export interface Loja {
  _id: string;
  nome: string;
  categoria: string;
  descricao: string;
  whatsapp: string;
  feira: string | Feira;
}

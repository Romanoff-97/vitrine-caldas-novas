import { Feira } from './feira.interface';

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

export interface Loja {
  _id: string;
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
  diasFuncionamento?: number[];
  feira: Feira;
}

export type ILoja = Loja;

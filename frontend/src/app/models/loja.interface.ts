import { Feira } from './feira.interface';

export interface IProdutoFoto {
  url: string;
  publicId: string;
}

export interface Loja {
  _id: string;
  nome: string;
  categoria: string;
  descricao: string;
  whatsapp: string;
  imagemUrl?: string;
  horarioFuncionamento?: string;
  galeria?: IProdutoFoto[];
  diasFuncionamento?: number[];
  feira: Feira;
}

export type ILoja = Loja;

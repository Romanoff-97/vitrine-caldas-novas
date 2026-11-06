export interface Feira {
  _id: string;
  nome: string;
  diasFuncionamento: number[];
  localizacao: string;
  mapsUrl?: string;
  horarioFuncionamento?: string;
  ativo: boolean;
}

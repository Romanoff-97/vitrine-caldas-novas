export interface Feira {
  _id: string;
  nome: string;
  diasFuncionamento: number[];
  localizacao: string;
  mapsUrl?: string;
  ativo: boolean;
}

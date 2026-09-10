import Feira, { type IFeira } from '../models/feira';

export class FeiraV1Service {
  public async listarFeiras(): Promise<IFeira[]> {
    return await Feira.find({ ativo: true });
  }

  public async criarFeira(dados: Partial<IFeira>): Promise<IFeira> {
    const feira = new Feira(dados);
    return await feira.save();
  }
}

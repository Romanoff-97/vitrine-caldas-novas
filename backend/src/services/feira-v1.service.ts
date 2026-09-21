import Feira, { type IFeira } from '../models/feira';

export class FeiraV1Service {
  public async listarFeiras(): Promise<IFeira[]> {
    return await Feira.find({ ativo: true });
  }

  public async criarFeira(dados: Partial<IFeira>): Promise<IFeira> {
    const feira = new Feira(dados);
    return await feira.save();
  }

  public async buscarPorId(id: string): Promise<IFeira | null> {
    return await Feira.findById(id);
  }

  public async atualizarFeira(id: string, dados: Partial<IFeira>): Promise<IFeira | null> {
    return await Feira.findByIdAndUpdate(id, dados, { new: true });
  }
}

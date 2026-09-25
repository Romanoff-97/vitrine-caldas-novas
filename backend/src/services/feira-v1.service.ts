import Feira, { type IFeira } from '../models/feira';
import Loja from '../models/loja';

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

  public async excluirFeira(id: string): Promise<boolean> {
    const feiraExistente = await Feira.findById(id);
    if (!feiraExistente) {
      return false;
    }

    // Exclusão em cascata: remove todas as lojas vinculadas à feira
    await Loja.deleteMany({ feira: id });

    // Remove a feira
    await Feira.findByIdAndDelete(id);
    return true;
  }
}

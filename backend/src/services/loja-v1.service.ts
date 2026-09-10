import Loja, { type ILoja } from '../models/loja';
import { Types } from 'mongoose';

export class LojaV1Service {
  public async listarLojasPorFeira(feiraId: string): Promise<ILoja[]> {
    return await Loja.find({ feira: new Types.ObjectId(feiraId) });
  }

  // requisito RF06 (Filtro de busca global)
  public async buscarLojas(termo: string): Promise<ILoja[]> {
    return await Loja.find({ 
      $or: [
        { nome: { $regex: termo, $options: 'i' } },
        { descricao: { $regex: termo, $options: 'i' } },
        { categoria: { $regex: termo, $options: 'i' } }
      ]
    }).populate('feira');
  }

  public async criarLoja(dados: Partial<ILoja>): Promise<ILoja> {
    const loja = new Loja(dados);
    return await loja.save();
  }
}

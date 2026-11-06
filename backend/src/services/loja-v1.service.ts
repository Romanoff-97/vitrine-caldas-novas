import Loja, { type ILoja } from '../models/loja';
import Feira from '../models/feira';
import { Types } from 'mongoose';
import { CloudinaryService } from './cloudinary.service';

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
    if (!dados.feira) {
      throw new Error('A feira vinculada é obrigatória para cadastrar a loja.');
    }

    const feira = await Feira.findById(dados.feira);
    if (!feira) {
      throw new Error('Feira vinculada não encontrada.');
    }

    if (!dados.diasFuncionamento || dados.diasFuncionamento.length === 0) {
      dados.diasFuncionamento = [...feira.diasFuncionamento];
    } else {
      const diasInvalidos = dados.diasFuncionamento.filter(dia => !feira.diasFuncionamento.includes(dia));
      if (diasInvalidos.length > 0) {
        throw new Error(`A loja só pode operar nos dias em que a feira funciona. Dias inválidos informados: ${diasInvalidos.join(', ')}`);
      }
    }

    const loja = new Loja(dados);
    return await loja.save();
  }

  public async atualizarLoja(id: string, dados: Partial<ILoja>): Promise<ILoja | null> {
    const lojaExistente = await Loja.findById(id);
    if (!lojaExistente) {
      return null;
    }

    const feiraId = dados.feira || lojaExistente.feira;
    const feira = await Feira.findById(feiraId);
    if (!feira) {
      throw new Error('Feira vinculada não encontrada.');
    }

    if (dados.diasFuncionamento) {
      if (dados.diasFuncionamento.length === 0) {
        dados.diasFuncionamento = [...feira.diasFuncionamento];
      } else {
        const diasInvalidos = dados.diasFuncionamento.filter(dia => !feira.diasFuncionamento.includes(dia));
        if (diasInvalidos.length > 0) {
          throw new Error(`A loja só pode operar nos dias em que a feira funciona. Dias inválidos informados: ${diasInvalidos.join(', ')}`);
        }
      }
    }

    // Higienização no Cloudinary: se uma nova imagem foi enviada e a loja já possuía imagem anterior, exclui a anterior
    if (dados.imagemUrl && lojaExistente.imagemUrl && dados.imagemUrl !== lojaExistente.imagemUrl) {
      await CloudinaryService.excluirImagem(lojaExistente.imagemUrl);
    }

    return await Loja.findByIdAndUpdate(id, dados, { new: true }).populate('feira');
  }

  public async buscarPorId(id: string): Promise<ILoja | null> {
    return await Loja.findById(id).populate('feira');
  }

  public async excluirLoja(id: string): Promise<boolean> {
    const lojaExistente = await Loja.findById(id);
    if (!lojaExistente) {
      return false;
    }

    // Higienização no Cloudinary: exclui a imagem vinculada à loja antes de remover do banco
    if (lojaExistente.imagemUrl) {
      await CloudinaryService.excluirImagem(lojaExistente.imagemUrl);
    }

    await Loja.findByIdAndDelete(id);
    return true;
  }
}

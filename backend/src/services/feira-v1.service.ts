import Feira, { type IFeira } from '../models/feira';
import Loja from '../models/loja';
import { CloudinaryService } from './cloudinary.service';

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
    const feiraExistente = await Feira.findById(id);
    if (!feiraExistente) {
      return null;
    }

    if ((dados as any).imagemUrl && (feiraExistente as any).imagemUrl && (dados as any).imagemUrl !== (feiraExistente as any).imagemUrl) {
      await CloudinaryService.excluirImagem((feiraExistente as any).imagemUrl);
    }

    return await Feira.findByIdAndUpdate(id, dados, { new: true });
  }

  public async excluirFeira(id: string): Promise<boolean> {
    const feiraExistente = await Feira.findById(id);
    if (!feiraExistente) {
      return false;
    }

    // Higienização no Cloudinary das lojas vinculadas que possuem imagem antes da exclusão em cascata
    const lojasVinculadas = await Loja.find({ feira: id });
    for (const loja of lojasVinculadas) {
      if (loja.imagemUrl) {
        await CloudinaryService.excluirImagem(loja.imagemUrl);
      }
      if (loja.galeria && loja.galeria.length > 0) {
        for (const foto of loja.galeria) {
          if (foto.publicId) {
            await CloudinaryService.excluirImagem(foto.publicId);
          }
        }
      }
    }

    // Higienização no Cloudinary caso a própria feira possua imagem
    if ((feiraExistente as any).imagemUrl) {
      await CloudinaryService.excluirImagem((feiraExistente as any).imagemUrl);
    }

    // Exclusão em cascata: remove todas as lojas vinculadas à feira
    await Loja.deleteMany({ feira: id });

    // Remove a feira
    await Feira.findByIdAndDelete(id);
    return true;
  }
}

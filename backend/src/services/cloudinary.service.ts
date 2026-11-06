import { v2 as cloudinary } from 'cloudinary';

// Garante que o SDK leia a configuração de CLOUDINARY_URL do process.env
cloudinary.config(true);

export class CloudinaryService {
  /**
   * Extrai o public_id de uma URL padrão do Cloudinary.
   * Exemplo: https://res.cloudinary.com/.../upload/v12345/vitrine-caldas-novas/foto.jpg -> "vitrine-caldas-novas/foto"
   */
  public static extrairPublicId(url: string): string | null {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
      const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
      const matches = url.match(regex);
      return matches && matches[1] ? matches[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Exclui uma imagem do Cloudinary usando a URL completa ou o publicId.
   */
  public static async excluirImagem(urlOuPublicId: string): Promise<boolean> {
    if (!urlOuPublicId) return false;

    const publicId = urlOuPublicId.includes('cloudinary.com')
      ? this.extrairPublicId(urlOuPublicId)
      : urlOuPublicId;

    if (!publicId) return false;

    try {
      const resultado = await cloudinary.uploader.destroy(publicId);
      return resultado.result === 'ok';
    } catch (error) {
      console.error(`[CloudinaryService] Erro ao excluir imagem (${publicId}):`, error);
      return false;
    }
  }
}


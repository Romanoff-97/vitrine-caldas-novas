import type { Request, Response } from 'express';
import { LojaV1Service } from '../services/loja-v1.service';

export class LojaV1Controller {
  private lojaService: LojaV1Service;

  constructor() {
    this.lojaService = new LojaV1Service();
  }

  public listarPorFeira = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { feiraId } = req.params as unknown as { feiraId: string };
      const lojas = await this.lojaService.listarLojasPorFeira(feiraId);
      return res.status(200).json(lojas);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  };

  public buscar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const termo = req.query.q as string;
      if (!termo) return res.status(400).json({ erro: 'Termo de busca obrigatório' });
      const lojas = await this.lojaService.buscarLojas(termo);
      return res.status(200).json(lojas);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  };

  public criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const novaLoja = await this.lojaService.criarLoja(req.body);
      return res.status(201).json(novaLoja);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  };
}

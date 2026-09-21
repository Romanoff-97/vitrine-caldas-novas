import type { Request, Response } from 'express';
import { FeiraV1Service } from '../services/feira-v1.service';

export class FeiraV1Controller {
  private feiraService: FeiraV1Service;

  constructor() {
    this.feiraService = new FeiraV1Service();
  }

  public listar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const feiras = await this.feiraService.listarFeiras();
      return res.status(200).json(feiras);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  };

  public criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const novaFeira = await this.feiraService.criarFeira(req.body);
      return res.status(201).json(novaFeira);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  };

  public obterPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params as unknown as { id: string };
      const feira = await this.feiraService.buscarPorId(id);
      if (!feira) {
        return res.status(404).json({ erro: 'Feira não encontrada' });
      }
      return res.status(200).json(feira);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params as unknown as { id: string };
      const feiraAtualizada = await this.feiraService.atualizarFeira(id, req.body);
      if (!feiraAtualizada) {
        return res.status(404).json({ erro: 'Feira não encontrada' });
      }
      return res.status(200).json(feiraAtualizada);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  };
}

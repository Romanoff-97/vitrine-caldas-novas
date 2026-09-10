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
}

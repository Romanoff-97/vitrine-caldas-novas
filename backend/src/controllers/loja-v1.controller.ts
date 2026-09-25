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

  private extrairDadosLoja(req: Request): Record<string, unknown> {
    const imagemUrl = req.file ? req.file.path : req.body?.imagemUrl;

    let diasFuncionamento = req.body?.diasFuncionamento;
    if (typeof diasFuncionamento === 'string') {
      try {
        diasFuncionamento = JSON.parse(diasFuncionamento);
      } catch {
        diasFuncionamento = diasFuncionamento
          .split(',')
          .map((d: string) => Number(d.trim()))
          .filter((n: number) => !isNaN(n));
      }
    }

    return {
      ...req.body,
      ...(imagemUrl ? { imagemUrl } : {}),
      ...(diasFuncionamento !== undefined ? { diasFuncionamento } : {})
    };
  }

  public criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dados = this.extrairDadosLoja(req);
      const novaLoja = await this.lojaService.criarLoja(dados);
      return res.status(201).json(novaLoja);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  };

  public obterPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params as unknown as { id: string };
      const loja = await this.lojaService.buscarPorId(id);
      if (!loja) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
      }
      return res.status(200).json(loja);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params as unknown as { id: string };
      const dados = this.extrairDadosLoja(req);
      const lojaAtualizada = await this.lojaService.atualizarLoja(id, dados);
      if (!lojaAtualizada) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
      }
      return res.status(200).json(lojaAtualizada);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  };

  public excluir = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params as unknown as { id: string };
      const excluida = await this.lojaService.excluirLoja(id);
      if (!excluida) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
      }
      return res.status(200).json({ mensagem: 'Loja excluída com sucesso.' });
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  };
}

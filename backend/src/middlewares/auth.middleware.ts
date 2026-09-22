import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Interface padronizada para resposta de erro de autenticação.
 */
export interface ErroAutenticacaoResponse {
  erro: string;
}

/**
 * Compara duas strings de forma constante no tempo (Constant-Time Comparison)
 * para evitar ataques de temporização (Timing Attacks).
 */
export function compararChavesComSeguranca(chaveRecebida: string, chaveEsperada: string): boolean {
  const bufferRecebido = Buffer.from(chaveRecebida);
  const bufferEsperado = Buffer.from(chaveEsperada);

  if (bufferRecebido.length !== bufferEsperado.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferRecebido, bufferEsperado);
}

/**
 * Recupera a chave administrativa configurada nas variáveis de ambiente.
 * Suporta ADMIN_API_KEY ou ADMIN_KEY com fallback para 'admin123' em desenvolvimento.
 */
export function obterChaveAdministrativaEsperada(): string {
  return process.env.ADMIN_API_KEY || process.env.ADMIN_KEY || 'admin123';
}

/**
 * Middleware Express para autenticação de requisições em rotas protegidas.
 * Aceita o token de autenticação através do header 'x-api-key' ou 'x-admin-key'.
 * Retorna status 401 (Unauthorized) caso ausente ou incorreto.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const chaveEsperada = obterChaveAdministrativaEsperada();
  const headerKey = req.headers['x-api-key'] || req.headers['x-admin-key'];

  if (!headerKey || typeof headerKey !== 'string') {
    const respostaErro: ErroAutenticacaoResponse = {
      erro: 'Acesso não autorizado. Chave de API (x-api-key ou x-admin-key) ausente ou inválida.'
    };
    res.status(401).json(respostaErro);
    return;
  }

  const ehValida = compararChavesComSeguranca(headerKey, chaveEsperada);

  if (!ehValida) {
    const respostaErro: ErroAutenticacaoResponse = {
      erro: 'Acesso não autorizado. Chave de autenticação incorreta.'
    };
    res.status(401).json(respostaErro);
    return;
  }

  next();
}

/**
 * Alias para compatibilidade com implementações existentes.
 */
export const adminAuthMiddleware = authMiddleware;

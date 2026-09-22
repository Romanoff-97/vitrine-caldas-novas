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
 * Utiliza exclusivamente ADMIN_KEY com fallback para 'admin123' em desenvolvimento.
 */
export function obterChaveAdministrativaEsperada(): string {
  return process.env.ADMIN_KEY!;
}

/**
 * Middleware Express para autenticação de requisições em rotas protegidas.
 * Valida o header 'x-admin-key' contra a chave administrativa configurada (ADMIN_KEY).
 * Retorna status 401 (Unauthorized) caso ausente ou incorreto.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const chaveEsperada = obterChaveAdministrativaEsperada();
  const headerKey = req.headers['x-admin-key'];

  if (!headerKey || typeof headerKey !== 'string') {
    const respostaErro: ErroAutenticacaoResponse = {
      erro: 'Acesso não autorizado. Chave administrativa (x-admin-key) ausente ou inválida.'
    };
    res.status(401).json(respostaErro);
    return;
  }

  const ehValida = compararChavesComSeguranca(headerKey, chaveEsperada);

  if (!ehValida) {
    const respostaErro: ErroAutenticacaoResponse = {
      erro: 'Acesso não autorizado. Chave administrativa incorreta.'
    };
    res.status(401).json(respostaErro);
    return;
  }

  next();
}

/**
 * Alias para compatibilidade com importações legadas.
 */
export const adminAuthMiddleware = authMiddleware;


import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar a chave de acesso administrativo nas rotas protegidas.
 * Compara o cabeçalho 'x-admin-key' com a variável de ambiente ADMIN_KEY.
 */
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_KEY || 'admin123';
  const providedKey = req.headers['x-admin-key'];

  if (!providedKey || providedKey !== adminKey) {
    res.status(401).json({
      erro: 'Acesso não autorizado. Chave administrativa inválida ou não fornecida.'
    });
    return;
  }

  next();
}

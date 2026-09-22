import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';

/**
 * Interceptor funcional do Angular 18 que anexa automaticamente
 * o header 'x-admin-key' nas requisições quando houver sessão ativa
 * no painel administrativo.
 */
export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AdminAuthService);
  const chave = authService.getChave();

  if (chave) {
    const reqClonada = req.clone({
      setHeaders: {
        'x-admin-key': chave
      }
    });
    return next(reqClonada);
  }

  return next(req);
};
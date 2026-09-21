import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

/**
 * Guard funcional do Angular 18 que protege o acesso às rotas administrativas.
 * Se o usuário não tiver chave ativa no sessionStorage, redireciona para /admin/login.
 */
export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: state.url }
  });
};

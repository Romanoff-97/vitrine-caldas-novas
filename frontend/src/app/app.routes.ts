import { Routes } from '@angular/router';
import { LayoutConsumidorComponent } from './layouts/layout-consumidor/layout-consumidor.component';
import { HomeComponent } from './pages/home/home.component';
import { LojasComponent } from './pages/lojas/lojas.component';
import { PerfilLojaComponent } from './pages/perfil-loja/perfil-loja.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { FormFeiraComponent } from './pages/admin/form-feira/form-feira.component';
import { FormLojaComponent } from './pages/admin/form-loja/form-loja.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutConsumidorComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'feira/:id', component: LojasComponent },
      { path: 'loja/:id', component: PerfilLojaComponent },
      { path: 'admin/login', component: AdminLoginComponent },
      { path: 'admin', component: AdminDashboardComponent, canActivate: [adminAuthGuard] },
      { path: 'admin/feira/nova', component: FormFeiraComponent, canActivate: [adminAuthGuard] },
      { path: 'admin/feira/:id/editar', component: FormFeiraComponent, canActivate: [adminAuthGuard] },
      { path: 'admin/loja/nova', component: FormLojaComponent, canActivate: [adminAuthGuard] },
      { path: 'admin/loja/:id/editar', component: FormLojaComponent, canActivate: [adminAuthGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];

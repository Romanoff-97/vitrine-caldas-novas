import { Routes } from '@angular/router';
import { LayoutConsumidorComponent } from './layouts/layout-consumidor/layout-consumidor.component';
import { HomeComponent } from './pages/home/home.component';
import { LojasComponent } from './pages/lojas/lojas.component';
import { PerfilLojaComponent } from './pages/perfil-loja/perfil-loja.component';
import { FormFeiraComponent } from './pages/admin/form-feira/form-feira.component';
import { FormLojaComponent } from './pages/admin/form-loja/form-loja.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutConsumidorComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'feira/:id', component: LojasComponent },
      { path: 'loja/:id', component: PerfilLojaComponent },
      { path: 'admin/feira/nova', component: FormFeiraComponent },
      { path: 'admin/feira/:id/editar', component: FormFeiraComponent },
      { path: 'admin/loja/nova', component: FormLojaComponent },
      { path: 'admin/loja/:id/editar', component: FormLojaComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

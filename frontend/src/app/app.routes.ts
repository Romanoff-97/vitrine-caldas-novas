import { Routes } from '@angular/router';
import { LayoutConsumidorComponent } from './layouts/layout-consumidor/layout-consumidor.component';
import { HomeComponent } from './pages/home/home.component';
import { LojasComponent } from './pages/lojas/lojas.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutConsumidorComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'feira/:id', component: LojasComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

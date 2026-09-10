import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LojasComponent } from './pages/lojas/lojas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'feira/:id', component: LojasComponent }, // Passando o ID da feira na URL
  { path: '**', redirectTo: '' } // Qualquer URL inválida volta pra Home
];

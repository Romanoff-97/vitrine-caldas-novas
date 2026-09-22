import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API } from '../utils/api';

export interface RespostaVerificacaoAdmin {
  valido: boolean;
  mensagem?: string;
  erro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'vitrine_admin_key';
  private apiUrl = API;

  getChave(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem(this.STORAGE_KEY);
    }
    return null;
  }

  estaAutenticado(): boolean {
    return Boolean(this.getChave());
  }

  login(chave: string): Observable<RespostaVerificacaoAdmin> {
    return this.http.post<RespostaVerificacaoAdmin>(`${this.apiUrl}/admin/verificar-chave`, { chave }).pipe(
      tap((resp) => {
        if (resp.valido && typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem(this.STORAGE_KEY, chave.trim());
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

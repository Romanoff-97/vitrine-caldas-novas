import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feira } from '../models/feira.interface';
import { Loja } from '../models/loja.interface';
import { RespostaMensagem } from '../models/resposta-api.interface';
import { API } from '../utils/api';
import { AdminAuthService } from './admin-auth.service';

export interface OpcoesListarFeiras {
  todas?: boolean;
  status?: 'todas' | 'ativas' | 'inativas';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private adminAuthService = inject(AdminAuthService);

  // A URL da API
  private apiUrl = API;

  /**
   * Constrói os cabeçalhos de autenticação para operações protegidas.
   * Utiliza exclusivamente o padrão 'x-admin-key'.
   */
  public getAuthHeaders(): HttpHeaders {
    return this.obterHeadersAutenticados();
  }

  private obterHeadersAutenticados(): HttpHeaders {
    const chave = this.adminAuthService.getChave();
    if (chave) {
      return new HttpHeaders({
        'x-admin-key': chave
      });
    }
    return new HttpHeaders();
  }


  // === FEIRAS ===
  getFeiras(opcoes?: OpcoesListarFeiras): Observable<Feira[]> {
    let params = new HttpParams();
    if (opcoes?.todas) {
      params = params.set('todas', 'true');
    }
    if (opcoes?.status) {
      params = params.set('status', opcoes.status);
    }
    return this.http.get<Feira[]>(`${this.apiUrl}/feiras`, { params });
  }

  getFeiraPorId(id: string): Observable<Feira> {
    return this.http.get<Feira>(`${this.apiUrl}/feiras/${id}`);
  }

  criarFeira(dados: Partial<Feira>): Observable<Feira> {
    return this.http.post<Feira>(`${this.apiUrl}/feiras`, dados, {
      headers: this.obterHeadersAutenticados()
    });
  }

  atualizarFeira(id: string, dados: Partial<Feira>): Observable<Feira> {
    return this.http.put<Feira>(`${this.apiUrl}/feiras/${id}`, dados, {
      headers: this.obterHeadersAutenticados()
    });
  }

  excluirFeira(id: string): Observable<RespostaMensagem> {
    return this.http.delete<RespostaMensagem>(`${this.apiUrl}/feiras/${id}`, {
      headers: this.obterHeadersAutenticados()
    });
  }

  // === LOJAS ===
  getLojasPorFeira(feiraId: string): Observable<Loja[]> {
    return this.http.get<Loja[]>(`${this.apiUrl}/lojas/feira/${feiraId}`);
  }

  buscarLojas(termo: string): Observable<Loja[]> {
    return this.http.get<Loja[]>(`${this.apiUrl}/lojas/buscar?q=${termo}`);
  }

  getLojaPorId(lojaId: string): Observable<Loja> {
    return this.http.get<Loja>(`${this.apiUrl}/lojas/${lojaId}`);
  }

  criarLoja(dados: FormData | Partial<Loja>): Observable<Loja> {
    return this.http.post<Loja>(`${this.apiUrl}/lojas`, dados, {
      headers: this.obterHeadersAutenticados()
    });
  }

  atualizarLoja(id: string, dados: FormData | Partial<Loja>): Observable<Loja> {
    return this.http.put<Loja>(`${this.apiUrl}/lojas/${id}`, dados, {
      headers: this.obterHeadersAutenticados()
    });
  }

  excluirLoja(id: string): Observable<RespostaMensagem> {
    return this.http.delete<RespostaMensagem>(`${this.apiUrl}/lojas/${id}`, {
      headers: this.obterHeadersAutenticados()
    });
  }

  // === GALERIA DE PRODUTOS ===
  uploadGaleria(lojaId: string, files: File[]): Observable<Loja> {
    const formData = new FormData();
    files.forEach(file => formData.append('fotos', file));
    return this.http.post<Loja>(`${this.apiUrl}/lojas/${lojaId}/galeria`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  removerFotoGaleria(lojaId: string, publicId: string): Observable<Loja> {
    return this.http.delete<Loja>(`${this.apiUrl}/lojas/${lojaId}/galeria`, {
      headers: this.getAuthHeaders(),
      body: { publicId }
    });
  }
}
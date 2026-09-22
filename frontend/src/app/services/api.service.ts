import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feira } from '../models/feira.interface';
import { Loja } from '../models/loja.interface';
import { API } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // A URL da API
  private apiUrl = API;

  constructor(private http: HttpClient) { }

  // === FEIRAS ===
  getFeiras(): Observable<Feira[]> {
    return this.http.get<Feira[]>(`${this.apiUrl}/feiras`);
  }

  getFeiraPorId(id: string): Observable<Feira> {
    return this.http.get<Feira>(`${this.apiUrl}/feiras/${id}`);
  }

  criarFeira(dados: Partial<Feira>): Observable<Feira> {
    return this.http.post<Feira>(`${this.apiUrl}/feiras`, dados);
  }

  atualizarFeira(id: string, dados: Partial<Feira>): Observable<Feira> {
    return this.http.put<Feira>(`${this.apiUrl}/feiras/${id}`, dados);
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

  criarLoja(dados: Partial<Loja>): Observable<Loja> {
    return this.http.post<Loja>(`${this.apiUrl}/lojas`, dados);
  }

  atualizarLoja(id: string, dados: Partial<Loja>): Observable<Loja> {
    return this.http.put<Loja>(`${this.apiUrl}/lojas/${id}`, dados);
  }
}

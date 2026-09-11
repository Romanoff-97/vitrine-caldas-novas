import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feira } from '../models/feira.interface';
import { Loja } from '../models/loja.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // A URL onde a api está rodando localmente
  // private apiUrl = 'http://localhost:3000/api';
  private apiUrl = 'https://vitrine-cn-backend.onrender.com/api';

  constructor(private http: HttpClient) { }

  // === FEIRAS ===
  getFeiras(): Observable<Feira[]> {
    return this.http.get<Feira[]>(`${this.apiUrl}/feiras`);
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
}

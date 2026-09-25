import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { Feira } from '../../../models/feira.interface';
import { Loja } from '../../../models/loja.interface';

export interface FeiraItemAdmin {
  feira: Feira;
  lojas: Loja[];
  carregandoLojas: boolean;
  expandida: boolean;
}

export interface ItemExclusaoAdmin {
  tipo: 'feira' | 'loja';
  id: string;
  nome: string;
  feiraId?: string;
  feiraNome?: string;
  qtdLojas?: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AdminAuthService);
  private router = inject(Router);

  carregando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;
  feirasAdmin: FeiraItemAdmin[] = [];

  itemExclusao: ItemExclusaoAdmin | null = null;
  excluindo: boolean = false;

  readonly nomesDias: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    this.mensagemErro = null;

    this.apiService.getFeiras().subscribe({
      next: (feiras: Feira[]) => {
        this.feirasAdmin = feiras.map((feira: Feira) => ({
          feira,
          lojas: [],
          carregandoLojas: true,
          expandida: true
        }));

        this.carregando = false;

        // Carrega as lojas de cada feira
        this.feirasAdmin.forEach((item: FeiraItemAdmin) => {
          this.carregarLojasDaFeira(item);
        });
      },
      error: (err) => {
        console.error('Erro ao listar feiras para o admin', err);
        this.mensagemErro = 'Não foi possível carregar as feiras. Verifique a conexão com a API.';
        this.carregando = false;
      }
    });
  }

  private carregarLojasDaFeira(item: FeiraItemAdmin): void {
    this.apiService.getLojasPorFeira(item.feira._id).subscribe({
      next: (lojas: Loja[]) => {
        item.lojas = lojas;
        item.carregandoLojas = false;
      },
      error: (err) => {
        console.error(`Erro ao carregar lojas da feira ${item.feira.nome}`, err);
        item.carregandoLojas = false;
      }
    });
  }

  abrirModalExcluirFeira(item: FeiraItemAdmin): void {
    this.mensagemErro = null;
    this.itemExclusao = {
      tipo: 'feira',
      id: item.feira._id,
      nome: item.feira.nome,
      qtdLojas: item.lojas.length
    };
  }

  abrirModalExcluirLoja(loja: Loja, feira: Feira): void {
    this.mensagemErro = null;
    this.itemExclusao = {
      tipo: 'loja',
      id: loja._id,
      nome: loja.nome,
      feiraId: feira._id,
      feiraNome: feira.nome
    };
  }

  fecharModalExclusao(): void {
    if (this.excluindo) return;
    this.itemExclusao = null;
  }

  confirmarExclusao(): void {
    if (!this.itemExclusao || this.excluindo) return;

    this.excluindo = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.itemExclusao.tipo === 'feira') {
      const feiraId = this.itemExclusao.id;
      const feiraNome = this.itemExclusao.nome;

      this.apiService.excluirFeira(feiraId).subscribe({
        next: () => {
          this.feirasAdmin = this.feirasAdmin.filter(f => f.feira._id !== feiraId);
          this.excluindo = false;
          this.itemExclusao = null;
          this.mensagemSucesso = `A feira "${feiraNome}" e suas lojas vinculadas foram excluídas com sucesso.`;
          this.limparMensagemAposTempo();
        },
        error: (err) => {
          console.error('Erro ao excluir feira', err);
          this.excluindo = false;
          this.mensagemErro = err?.error?.erro || 'Não foi possível excluir a feira. Tente novamente.';
        }
      });
    } else {
      const lojaId = this.itemExclusao.id;
      const lojaNome = this.itemExclusao.nome;
      const feiraId = this.itemExclusao.feiraId;

      this.apiService.excluirLoja(lojaId).subscribe({
        next: () => {
          if (feiraId) {
            const itemFeira = this.feirasAdmin.find(f => f.feira._id === feiraId);
            if (itemFeira) {
              itemFeira.lojas = itemFeira.lojas.filter(l => l._id !== lojaId);
            }
          }
          this.excluindo = false;
          this.itemExclusao = null;
          this.mensagemSucesso = `A loja "${lojaNome}" foi excluída com sucesso.`;
          this.limparMensagemAposTempo();
        },
        error: (err) => {
          console.error('Erro ao excluir loja', err);
          this.excluindo = false;
          this.mensagemErro = err?.error?.erro || 'Não foi possível excluir a loja. Tente novamente.';
        }
      });
    }
  }

  private limparMensagemAposTempo(): void {
    setTimeout(() => {
      this.mensagemSucesso = null;
    }, 4000);
  }

  toggleExpansao(item: FeiraItemAdmin): void {
    item.expandida = !item.expandida;
  }

  formatarDias(dias?: number[]): string {
    if (!dias || dias.length === 0) return 'Todos os dias';
    if (dias.length === 7) return 'Todos os dias';
    return dias.map(d => this.nomesDias[d] ?? '').filter(Boolean).join(', ');
  }

  isUrlValida(url?: string): boolean {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

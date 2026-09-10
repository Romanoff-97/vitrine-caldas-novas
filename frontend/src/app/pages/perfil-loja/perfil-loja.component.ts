import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Loja } from '../../models/loja.interface';
import { Feira } from '../../models/feira.interface';

@Component({
  selector: 'app-perfil-loja',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './perfil-loja.component.html',
  styleUrl: './perfil-loja.component.scss',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class PerfilLojaComponent implements OnInit {
  public loja: Loja | null = null;
  public loading: boolean = true;
  public erro: string | null = null;

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  ngOnInit(): void {
    const lojaId = this.route.snapshot.paramMap.get('id');
    if (lojaId) {
      this.carregarLoja(lojaId);
    } else {
      this.erro = 'Identificador da loja não informado.';
      this.loading = false;
    }
  }

  private carregarLoja(id: string): void {
    this.apiService.getLojaPorId(id).subscribe({
      next: (dados: Loja) => {
        this.loja = dados;
      },
      error: (err: unknown) => {
        console.error('Erro ao buscar perfil da loja', err);
        this.erro = 'Não foi possível carregar o perfil da loja.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  public obterNomeFeira(feira: string | Feira | undefined): string {
    if (!feira) return '';
    if (typeof feira === 'object' && 'nome' in feira) {
      return feira.nome;
    }
    return '';
  }

  public obterIdFeira(feira: string | Feira | undefined): string | null {
    if (!feira) return null;
    if (typeof feira === 'object' && '_id' in feira) {
      return feira._id;
    }
    if (typeof feira === 'string') {
      return feira;
    }
    return null;
  }

  public isUrlImagem(valor?: string): boolean {
    if (!valor) return false;
    return valor.startsWith('http://') || valor.startsWith('https://') || valor.startsWith('/') || valor.startsWith('data:image');
  }

  public abrirWhatsApp(numero?: string, nomeLoja?: string): void {
    if (!numero) return;
    const numLimpo = numero.replace(/\D/g, '');
    const nome = nomeLoja || 'sua loja';
    const texto = encodeURIComponent(`Olá! Vi o perfil da ${nome} na Vitrine Caldas Novas.`);
    window.open(`https://wa.me/55${numLimpo}?text=${texto}`, '_blank');
  }

  public formatarDias(dias?: number[]): string {
    if (!dias || dias.length === 0) return 'Consulte o(s) dia(s) de funcionamento';
    if (dias.length === 7) return 'Todos os dias';
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map(d => nomes[d] ?? '').filter(Boolean).join(', ');
  }
}

import { Component, OnInit, inject, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Loja, IItinerarioParada } from '../../models/loja.interface';
import { Feira } from '../../models/feira.interface';
import { LinkifyPipe } from '../../pipes/linkify.pipe';

@Component({
  selector: 'app-perfil-loja',
  standalone: true,
  imports: [RouterModule, CommonModule, LinkifyPipe],
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
  public fotoModalUrl: string | null = null;

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.fotoModalUrl) {
      this.fecharFotoModal();
    }
  }

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

  readonly nomesDiasCompletos: string[] = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  public get diaSemanaAtual(): number {
    return new Date().getDay();
  }

  public get paradaHoje(): IItinerarioParada | null {
    if (!this.loja?.itinerario || this.loja.itinerario.length === 0) return null;
    const hoje = this.diaSemanaAtual;
    return this.loja.itinerario.find(p => p.dias.includes(hoje)) || null;
  }

  public formatarDiasItinerario(dias: number[]): string {
    if (!dias || dias.length === 0) return '';
    const nomesCurtos = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map(d => nomesCurtos[d] ?? '').filter(Boolean).join(', ');
  }

  public formatarUrlInstagram(instagram?: string): string {
    if (!instagram) return '';
    const limpo = instagram.trim();
    if (limpo.startsWith('http://') || limpo.startsWith('https://')) {
      return limpo;
    }
    const perfil = limpo.startsWith('@') ? limpo.substring(1) : limpo;
    return `https://instagram.com/${perfil}`;
  }

  public abrirFotoModal(url: string): void {
    this.fotoModalUrl = url;
  }

  public fecharFotoModal(): void {
    this.fotoModalUrl = null;
  }
}

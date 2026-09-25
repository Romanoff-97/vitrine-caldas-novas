import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Loja } from '../../models/loja.interface';
import { Feira } from '../../models/feira.interface';

@Component({
  selector: 'app-lojas',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lojas.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class LojasComponent implements OnInit {
  feira: Feira | null = null;
  lojas: Loja[] = [];
  lojasFiltradas: Loja[] = [];
  public loading: boolean = true;

  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const feiraId = this.route.snapshot.paramMap.get('id');
    if (feiraId) {
      // Carrega informações da feira
      this.apiService.getFeiraPorId(feiraId).subscribe({
        next: (dadosFeira: Feira) => {
          this.feira = dadosFeira;
        },
        error: (err) => {
          console.error('Erro ao buscar dados da feira', err);
        }
      });

      // Carrega lojas da feira
      this.apiService.getLojasPorFeira(feiraId).subscribe({
        next: (dados) => {
          this.lojas = dados;
          this.lojasFiltradas = dados; // Iniciam iguais
        },
        error: (err) => {
          console.error('Erro ao buscar lojas', err);
          this.loading = false;
        },
        complete: () => this.loading = false
      });
    } else {
      this.loading = false;
    }
  }

  // Implementação do RF06 de forma ultrarrápida (pesquisa direto na memória da tela)
  filtrarLojas(evento: Event) {
    const termo = (evento.target as HTMLInputElement).value.toLowerCase();
    this.lojasFiltradas = this.lojas.filter(loja =>
      loja.nome.toLowerCase().includes(termo) ||
      loja.categoria.toLowerCase().includes(termo) ||
      loja.descricao.toLowerCase().includes(termo)
    );
  }

  abrirWhatsApp(numero: string, nomeLoja: string) {
    const numLimpo = numero.replace(/\D/g, ''); // Tira traços e espaços do numero
    const texto = encodeURIComponent(`Olá! Vi a sua loja (${nomeLoja}) na Vitrine Caldas Novas.`);
    window.open(`https://wa.me/55${numLimpo}?text=${texto}`, '_blank');
  }

  isUrlImagem(valor?: string): boolean {
    if (!valor) return false;
    return valor.startsWith('http://') || valor.startsWith('https://') || valor.startsWith('/') || valor.startsWith('data:image');
  }

  formatarDias(dias?: number[]): string {
    if (!dias || dias.length === 0) return 'Consulte dias';
    if (dias.length === 7) return 'Todos os dias';
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map(d => nomes[d] ?? '').filter(Boolean).join(', ');
  }
}

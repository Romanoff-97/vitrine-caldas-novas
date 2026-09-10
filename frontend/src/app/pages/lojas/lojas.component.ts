import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Loja } from '../../models/loja.interface';

@Component({
  selector: 'app-lojas',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lojas.component.html'
})
export class LojasComponent implements OnInit {
  lojas: Loja[] = [];
  lojasFiltradas: Loja[] = [];
  public loading: boolean = true;
  
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const feiraId = this.route.snapshot.paramMap.get('id');
    if (feiraId) {
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
}

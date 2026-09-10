import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Feira } from '../../models/feira.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  feiras: Feira[] = [];
  private apiService = inject(ApiService);
  public loading: boolean = true;

  ngOnInit() {
    this.apiService.getFeiras().subscribe({
      next: (dados) => {
        this.feiras = dados.filter(x => x.ativo);
        console.log(dados)
      },
      error: (err) => {
        console.error('Erro ao buscar feiras', err);
        this.loading = false;
      },
      complete: () => this.loading = false
    })
  }

  formatarDias(dias?: number[]): string {
    if (!dias || dias.length === 0) return 'Consulte horários';
    if (dias.length === 7) return 'Todos os dias';
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map(d => nomes[d] ?? '').filter(Boolean).join(', ');
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Feira } from '../../../models/feira.interface';

interface DiaSemanaItem {
  label: string;
  valor: number;
}

@Component({
  selector: 'app-form-feira',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './form-feira.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class FormFeiraComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  feiraId: string | null = null;
  isEdicao: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  readonly diasSemana: DiaSemanaItem[] = [
    { label: 'Dom', valor: 0 },
    { label: 'Seg', valor: 1 },
    { label: 'Ter', valor: 2 },
    { label: 'Qua', valor: 3 },
    { label: 'Qui', valor: 4 },
    { label: 'Sex', valor: 5 },
    { label: 'Sáb', valor: 6 },
  ];

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    localizacao: ['', [Validators.required, Validators.minLength(3)]],
    diasFuncionamento: this.fb.control<number[]>([], [Validators.required, Validators.minLength(1)]),
    ativo: [true, [Validators.required]]
  });

  ngOnInit(): void {
    this.feiraId = this.route.snapshot.paramMap.get('id');
    if (this.feiraId) {
      this.isEdicao = true;
      this.carregarFeira(this.feiraId);
    }
  }

  private carregarFeira(id: string): void {
    this.carregando = true;
    this.mensagemErro = null;

    this.apiService.getFeiraPorId(id).subscribe({
      next: (feira: Feira) => {
        this.form.patchValue({
          nome: feira.nome,
          localizacao: feira.localizacao,
          diasFuncionamento: feira.diasFuncionamento ?? [],
          ativo: feira.ativo ?? true
        });
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar feira', err);
        this.mensagemErro = 'Não foi possível carregar os dados da feira.';
        this.carregando = false;
      }
    });
  }

  toggleDia(dia: number): void {
    const atuais = [...(this.form.controls.diasFuncionamento.value ?? [])];
    const index = atuais.indexOf(dia);
    if (index > -1) {
      atuais.splice(index, 1);
    } else {
      atuais.push(dia);
      atuais.sort((a, b) => a - b);
    }
    this.form.controls.diasFuncionamento.setValue(atuais);
    this.form.controls.diasFuncionamento.markAsDirty();
    this.form.controls.diasFuncionamento.markAsTouched();
  }

  isDiaSelecionado(dia: number): boolean {
    return (this.form.controls.diasFuncionamento.value ?? []).includes(dia);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    const payload: Partial<Feira> = {
      nome: this.form.value.nome!.trim(),
      localizacao: this.form.value.localizacao!.trim(),
      diasFuncionamento: this.form.value.diasFuncionamento!,
      ativo: Boolean(this.form.value.ativo)
    };

    const operacao$ = this.isEdicao && this.feiraId
      ? this.apiService.atualizarFeira(this.feiraId, payload)
      : this.apiService.criarFeira(payload);

    operacao$.subscribe({
      next: () => {
        this.salvando = false;
        this.mensagemSucesso = this.isEdicao
          ? 'Feira atualizada com sucesso!'
          : 'Feira cadastrada com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (err) => {
        console.error('Erro ao salvar feira', err);
        this.salvando = false;
        this.mensagemErro = err?.error?.erro || 'Erro ao processar requisição. Verifique os dados informados.';
      }
    });
  }
}

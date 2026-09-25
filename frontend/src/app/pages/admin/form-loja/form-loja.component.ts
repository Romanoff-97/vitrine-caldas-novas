import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Feira } from '../../../models/feira.interface';
import { Loja } from '../../../models/loja.interface';

interface DiaSemanaItem {
  label: string;
  valor: number;
}

@Component({
  selector: 'app-form-loja',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './form-loja.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class FormLojaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  lojaId: string | null = null;
  isEdicao: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  fotoFile: File | null = null;
  fotoPreview: string | null = null;

  feiras: Feira[] = [];
  feiraSelecionada: Feira | null = null;

  readonly todosDiasSemana: DiaSemanaItem[] = [
    { label: 'Dom', valor: 0 },
    { label: 'Seg', valor: 1 },
    { label: 'Ter', valor: 2 },
    { label: 'Qua', valor: 3 },
    { label: 'Qui', valor: 4 },
    { label: 'Sex', valor: 5 },
    { label: 'Sáb', valor: 6 },
  ];

  form = this.fb.group({
    feira: ['', [Validators.required]],
    nome: ['', [Validators.required, Validators.minLength(2)]],
    categoria: ['', [Validators.required, Validators.minLength(2)]],
    descricao: ['', [Validators.required, Validators.minLength(5)]],
    whatsapp: ['', [Validators.required, Validators.minLength(10)]],
    imagemUrl: [''],
    diasFuncionamento: this.fb.control<number[]>([])
  });

  ngOnInit(): void {
    this.lojaId = this.route.snapshot.paramMap.get('id');
    this.isEdicao = Boolean(this.lojaId);

    this.carregarFeiras();
  }

  private carregarFeiras(): void {
    this.carregando = true;
    this.apiService.getFeiras().subscribe({
      next: (feiras) => {
        this.feiras = feiras.filter(f => f.ativo);
        if (this.isEdicao && this.lojaId) {
          this.carregarLoja(this.lojaId);
        } else {
          const feiraQuery = this.route.snapshot.queryParamMap.get('feiraId');
          if (feiraQuery && this.feiras.some(f => f._id === feiraQuery)) {
            this.form.patchValue({ feira: feiraQuery });
            this.onFeiraChange(feiraQuery);
          }
          this.carregando = false;
        }
      },
      error: (err) => {
        console.error('Erro ao listar feiras', err);
        this.mensagemErro = 'Não foi possível carregar a lista de feiras.';
        this.carregando = false;
      }
    });
  }

  private carregarLoja(id: string): void {
    this.apiService.getLojaPorId(id).subscribe({
      next: (loja: Loja) => {
        const feiraId = typeof loja.feira === 'object' ? loja.feira._id : loja.feira;
        this.form.patchValue({
          feira: feiraId,
          nome: loja.nome,
          categoria: loja.categoria,
          descricao: loja.descricao,
          whatsapp: loja.whatsapp,
          imagemUrl: loja.imagemUrl ?? '',
          diasFuncionamento: loja.diasFuncionamento ?? []
        });

        if (loja.imagemUrl) {
          this.fotoPreview = loja.imagemUrl;
        }

        this.onFeiraChange(feiraId);
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados da loja', err);
        this.mensagemErro = 'Não foi possível carregar os dados da loja.';
        this.carregando = false;
      }
    });
  }

  onFeiraChange(feiraId: string): void {
    const feira = this.feiras.find(f => f._id === feiraId);
    this.feiraSelecionada = feira || null;

    if (this.feiraSelecionada) {
      // Se dias selecionados anteriormente não pertencem à nova feira, filtra
      const diasAtuais = this.form.controls.diasFuncionamento.value ?? [];
      const diasValidos = diasAtuais.filter(d => this.feiraSelecionada!.diasFuncionamento.includes(d));

      // Se nenhum dia estiver marcado, herda todos os dias da feira
      if (diasValidos.length === 0) {
        this.form.controls.diasFuncionamento.setValue([...this.feiraSelecionada.diasFuncionamento]);
      } else {
        this.form.controls.diasFuncionamento.setValue(diasValidos);
      }
    }
  }

  isDiaPermitidoPelaFeira(dia: number): boolean {
    if (!this.feiraSelecionada) return true;
    return this.feiraSelecionada.diasFuncionamento.includes(dia);
  }

  toggleDia(dia: number): void {
    if (!this.isDiaPermitidoPelaFeira(dia)) return;

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
  }

  isDiaSelecionado(dia: number): boolean {
    return (this.form.controls.diasFuncionamento.value ?? []).includes(dia);
  }

  formatarWhatsAppInput(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 10) {
      input.value = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
    } else if (valor.length > 6) {
      input.value = `(${valor.substring(0, 2)}) ${valor.substring(2, 6)}-${valor.substring(6)}`;
    } else if (valor.length > 2) {
      input.value = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
    } else if (valor.length > 0) {
      input.value = `(${valor}`;
    }

    this.form.controls.whatsapp.setValue(input.value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fotoFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto(): void {
    this.fotoFile = null;
    this.fotoPreview = null;
    this.form.controls.imagemUrl.setValue('');
  }

  get fotoTamanhoFormatado(): string {
    if (!this.fotoFile) return '';
    return `${Math.round(this.fotoFile.size / 1024)} KB`;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    const dias = this.form.value.diasFuncionamento && this.form.value.diasFuncionamento.length > 0
      ? this.form.value.diasFuncionamento
      : (this.feiraSelecionada?.diasFuncionamento ?? []);

    const formData = new FormData();
    formData.append('feira', this.form.value.feira!);
    formData.append('nome', this.form.value.nome!.trim());
    formData.append('categoria', this.form.value.categoria!.trim());
    formData.append('descricao', this.form.value.descricao!.trim());
    formData.append('whatsapp', this.form.value.whatsapp!.trim());
    formData.append('diasFuncionamento', JSON.stringify(dias));

    if (this.fotoFile) {
      formData.append('imagem', this.fotoFile);
    } else if (this.form.value.imagemUrl) {
      formData.append('imagemUrl', this.form.value.imagemUrl);
    }

    const operacao$ = this.isEdicao && this.lojaId
      ? this.apiService.atualizarLoja(this.lojaId, formData)
      : this.apiService.criarLoja(formData);

    operacao$.subscribe({
      next: (_lojaSalva) => {
        this.salvando = false;
        this.mensagemSucesso = this.isEdicao
          ? 'Loja atualizada com sucesso!'
          : 'Loja cadastrada com sucesso!';

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1200);
      },
      error: (err) => {
        console.error('Erro ao salvar loja', err);
        this.salvando = false;
        this.mensagemErro = err?.error?.erro || 'Erro ao processar dados da loja. Verifique os campos.';
      }
    });
  }

  modalExclusaoAberto: boolean = false;
  excluindo: boolean = false;

  abrirModalExclusao(): void {
    this.modalExclusaoAberto = true;
  }

  fecharModalExclusao(): void {
    if (this.excluindo) return;
    this.modalExclusaoAberto = false;
  }

  confirmarExclusao(): void {
    if (!this.lojaId || this.excluindo) return;

    this.excluindo = true;
    this.mensagemErro = null;

    this.apiService.excluirLoja(this.lojaId).subscribe({
      next: () => {
        this.excluindo = false;
        this.modalExclusaoAberto = false;
        this.mensagemSucesso = 'Loja excluída com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1200);
      },
      error: (err) => {
        console.error('Erro ao excluir loja', err);
        this.excluindo = false;
        this.mensagemErro = err?.error?.erro || 'Erro ao excluir loja. Tente novamente.';
      }
    });
  }

  voltarParaPaginaAnterior() {
    this.router.navigate(['/admin']);
  }
}

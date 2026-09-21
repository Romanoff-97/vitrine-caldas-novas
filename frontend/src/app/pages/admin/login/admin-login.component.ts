import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class AdminLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AdminAuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  carregando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;
  mostrarSenha: boolean = false;
  returnUrl: string = '/admin';

  form = this.fb.group({
    chave: ['', [Validators.required, Validators.minLength(4)]]
  });

  ngOnInit(): void {
    // Se já estiver logado, redireciona diretamente para o painel
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/admin']);
      return;
    }

    const queryReturn = this.route.snapshot.queryParamMap.get('returnUrl');
    if (queryReturn) {
      this.returnUrl = queryReturn;
    }
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    const chave = this.form.value.chave!.trim();

    this.authService.login(chave).subscribe({
      next: (resp) => {
        this.carregando = false;
        if (resp.valido) {
          this.mensagemSucesso = 'Acesso liberado! Redirecionando...';
          setTimeout(() => {
            this.router.navigateByUrl(this.returnUrl);
          }, 800);
        } else {
          this.mensagemErro = resp.erro || 'Chave de acesso incorreta.';
        }
      },
      error: (err) => {
        console.error('Erro na autenticação administrativa', err);
        this.carregando = false;
        this.mensagemErro = err?.error?.erro || 'Chave de acesso inválida ou erro no servidor.';
      }
    });
  }
}

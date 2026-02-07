import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Interface para manter o contrato com o Backend
export interface PageResponse {
  valid: boolean;
  message?: string;
  page?: { id: string | number };
}

@Component({
  selector: 'acessar-pagina',
  templateUrl: './acessar-pagina.html',
  styleUrls: ['./acessar-pagina.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AcessarPagina {
  // Injeções
  private http = inject(HttpClient);
  private router = inject(Router);

  // Configurações

  // Estados Reativos (Signals)
  serialKey = '';
  loading = signal(false);
  errorMessage = signal('');

  buscarPagina(): void {
    const key = this.serialKey.trim();

    if (key.length < 6) {
      this.errorMessage.set('Serial inválido.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    // Substituí o <any> por um contrato simples
    this.http
      .get<{ valid: boolean; id?: number }>(`http://89.167.42.44:8080/access/check/${key}`)
      .subscribe({
        next: (res) => {
          if (res.valid) {
            // Se for válido e tiver o ID, navega para a edição
            this.router.navigate(['/edit', key]);
          } else {
            this.errorMessage.set('Serial não encontrado ou inválido.');
          }
        },
        error: (err) => {
          console.error('Erro na verificação:', err);
          this.errorMessage.set('Não foi possível validar o serial agora.');
        },
        complete: () => this.loading.set(false), // Garante que o loading pare sempre
      });
  }
}

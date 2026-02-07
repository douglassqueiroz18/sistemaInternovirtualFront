import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pagina',
  imports: [CommonModule, FormsModule],
  templateUrl: './criar-pagina.html',
  styleUrl: './criar-pagina.scss',
})
export class CriarPagina {
  quantidade: number = 1;
  mostrarConfirmacao: boolean = false;
  isLoading: boolean = false;
  mensagem: string = '';
  resultado: any = null;

  constructor(private http: HttpClient) {}

  iniciarCriacao() {
    if (this.quantidade <= 0 || this.quantidade > 1000) {
      this.mensagem = 'Quantidade deve ser entre 1 e 1000';
      return;
    }
    this.mostrarConfirmacao = true;
  }

  confirmarCriacao() {
    this.isLoading = true;
    this.mostrarConfirmacao = false;

    // Request BEM SIMPLES - só a quantidade
    const request = {
      quantidade: this.quantidade
    };

    this.http.post('http://89.167.42.44:8080/pagina/batch-simples', request)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.resultado = response;
          this.mensagem = `✅ ${response.mensagem}`;
        },
        error: (error) => {
          this.isLoading = false;
          this.mensagem = `❌ Erro: ${error.error?.message || error.message}`;
        }
      });
  }

  cancelarCriacao() {
    this.mostrarConfirmacao = false;
  }

  limparResultado() {
    this.resultado = null;
    this.mensagem = '';
  }
}

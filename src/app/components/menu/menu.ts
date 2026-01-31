import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  constructor(private http: HttpClient) {}
  // Lista de rotas disponíveis
  rotas = [
    {
      path: '/criar-pagina',
      titulo: '📝 Criar Página',
      descricao: 'Criar uma nova página individual',
      icone: '📝'
    },
    {
      path: '/criar-pagina',
      titulo: '⚡ Criar Múltiplas',
      descricao: 'Criar várias páginas de uma vez',
      icone: '⚡',
      queryParams: { modo: 'batch' }
    },
    {
      path: '/mostrar-paginas',
      titulo: '📋 Gerenciar Páginas',
      descricao: 'Ver e gerenciar todas as páginas',
      icone: '📋'
    },
    {
      path: '/access',
      titulo: '🔗 Acessar Página',
      descricao: 'Acessar página por serial key',
      icone: '🔗'
    },
    {
      path: '/page/',
      titulo: '👁️ Visualizar',
      descricao: 'Visualizar página (insira serial key)',
      icone: '👁️',
      precisaSerialKey: true
    },
    {
      path: '/edit/',
      titulo: '✏️ Editar',
      descricao: 'Editar página (insira serial key)',
      icone: '✏️',
      precisaSerialKey: true
    }
  ];

  // Serial key para visualizar/editar
  serialKeyInput: string = '';

  navegarParaRota(rota: any) {
    if (rota.precisaSerialKey && !this.serialKeyInput) {
      alert('Por favor, insira uma serial key primeiro!');
      return;
    }

    let url = rota.path;
    if (rota.precisaSerialKey) {
      url += this.serialKeyInput;
    }
    
    window.location.href = url;
  }
  carregarPaginaAleatoria() {
    this.http.get<any[]>('http://localhost:8080/pagina')
      .subscribe({
        next: (paginas) => {
          if (paginas.length > 0) {
            const paginaAleatoria = paginas[Math.floor(Math.random() * paginas.length)];
            if (paginaAleatoria.serialKey) {
              window.location.href = `/page/${paginaAleatoria.serialKey}`;
            } else {
              alert('Nenhuma página com serial key encontrada');
            }
          } else {
            alert('Nenhuma página cadastrada ainda');
          }
        },
        error: () => {
          alert('Erro ao carregar páginas');
        }
      });
  }

}
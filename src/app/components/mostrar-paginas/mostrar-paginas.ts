import { Component, OnInit } from '@angular/core';
import { CommonModule , DatePipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar-paginas',
  imports: [CommonModule, FormsModule],
  templateUrl: './mostrar-paginas.html',
  styleUrl: './mostrar-paginas.scss',
})
export class MostrarPaginas implements OnInit {
  // Lista de páginas
  paginas: any[] = [];

  // Filtros
  filtroNome: string = '';
  filtroSerialKey: string = '';
  filtroTipo: string = '';

  // Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 1;

  // Ordenação
  ordenarPor: string = 'nomeCartao';
  ordemAscendente: boolean = false;

  // Loading e estados
  carregando: boolean = false;
  erro: string = '';

  // Modal de detalhes
  paginaDetalhes: any = null;
  mostrarModal: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarPaginas();
  }

  carregarPaginas() {
    this.carregando = true;
    this.erro = '';

    this.http.get<any[]>('https://virtualnfc.com/pagina')
      .subscribe({
        next: (data) => {
          this.paginas = data;
          this.carregando = false;
          this.calcularPaginacao();
        },
        error: (error) => {
          this.erro = 'Erro ao carregar páginas: ' + error.message;
          this.carregando = false;
          console.error('Erro:', error);
        }
      });
  }
  voltar(){
    window.history.back();
  }
  // Filtra as páginas
  get paginasFiltradas() {
    let filtradas = this.paginas;

    // Filtro por nome
    if (this.filtroNome) {
      filtradas = filtradas.filter(p =>
        p.nomeCartao?.toLowerCase().includes(this.filtroNome.toLowerCase())
      );
    }

    // Filtro por serial key
    if (this.filtroSerialKey) {
      filtradas = filtradas.filter(p =>
        p.serialKey?.toLowerCase().includes(this.filtroSerialKey.toLowerCase())
      );
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      filtradas = filtradas.filter(p =>
        p.typePage?.toLowerCase() === this.filtroTipo.toLowerCase()
      );
    }

    // Ordenação
    filtradas.sort((a, b) => {
      let valorA = a[this.ordenarPor];
      let valorB = b[this.ordenarPor];

      // Converte para string se for nulo
      valorA = valorA === null ? '' : valorA;
      valorB = valorB === null ? '' : valorB;

      if (valorA < valorB) return this.ordemAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordemAscendente ? 1 : -1;
      return 0;
    });

    return filtradas;
  }

  // Paginação
  get paginasPaginaAtual() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.paginasFiltradas.slice(inicio, fim);
  }

  calcularPaginacao() {
    this.totalPaginas = Math.ceil(this.paginasFiltradas.length / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas) {
      this.paginaAtual = Math.max(1, this.totalPaginas);
    }
  }

  mudarPagina(pagina: number) {
    this.paginaAtual = Math.max(1, Math.min(pagina, this.totalPaginas));
  }

  ordenar(coluna: string) {
    if (this.ordenarPor === coluna) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.ordenarPor = coluna;
      this.ordemAscendente = true;
    }
      this.filtrarPaginas(); // Adicione esta linha

  }

  // Modal de detalhes
  abrirDetalhes(pagina: any) {
    this.paginaDetalhes = pagina;
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
    this.paginaDetalhes = null;
  }

  copiarSerialKey(serialKey: string) {
    navigator.clipboard.writeText(serialKey)
      .then(() => {
        alert('Serial Key copiada: ' + serialKey);
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
      });
  }

  gerarLinkAcesso(serialKey: string): string {
    return `${window.location.origin}/access/${serialKey}`;
  }

  copiarLinkAcesso(serialKey: string) {
    const link = this.gerarLinkAcesso(serialKey);
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Link copiado: ' + link);
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
      });
  }

  // Deletar página
  deletarPagina(id: number) {
    if (confirm('Tem certeza que deseja excluir esta página?')) {
      this.http.delete(`https://virtualnfc.com/pagina/${id}`)
        .subscribe({
          next: () => {
            this.paginas = this.paginas.filter(p => p.id !== id);
            this.calcularPaginacao();
            alert('Página excluída com sucesso!');
          },
          error: (error) => {
            alert('Erro ao excluir página: ' + error.message);
          }
        });
    }
  }

  // Resetar filtros
  resetarFiltros() {
    this.filtroNome = '';
    this.filtroSerialKey = '';
    this.filtroTipo = '';
    this.paginaAtual = 1;
  }

  // Contadores
  get totalPaginasContagem(): number {
    return this.paginas.length;
  }
  filtrarPaginas() {
    // Força a detecção de mudanças recalculando tudo
    this.calcularPaginacao();

  }

  get paginasFiltradasContagem(): number {
    return this.paginasFiltradas.length;
  }

  get paginasComDados(): number {
    return this.paginas.filter(p =>
      p.nomeCartao || p.instagram || p.whatsapp || p.email
    ).length;
  }

  get paginasEmBranco(): number {
    return this.paginas.filter(p =>
      !p.nomeCartao && !p.instagram && !p.whatsapp && !p.email
    ).length;
  }
}

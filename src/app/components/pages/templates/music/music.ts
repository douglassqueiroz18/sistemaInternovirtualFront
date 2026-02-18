import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageData } from '../../../models/page-data.model';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './music.html',
  styleUrls: ['./music.scss']
})
export class Music implements OnInit, OnDestroy {
  @Input() data!: PageData;
  pixCopiado: string | null = null;
  vinylPlaying = false;
  spectrumBars: { height: number }[] = [];
  private spectrumInterval: any;

  ngOnInit() {
    this.initializeSpectrum();
    this.startVinylAnimation();
  }

  ngOnDestroy() {
    if (this.spectrumInterval) {
      clearInterval(this.spectrumInterval);
    }
  }

  // Inicializa o espectro visual
  private initializeSpectrum() {
    // Cria 15 barras para o espectro
    this.spectrumBars = Array.from({ length: 15 }, () => ({
      height: Math.random() * 40 + 10
    }));

    // Anima o espectro
    this.spectrumInterval = setInterval(() => {
      this.spectrumBars = this.spectrumBars.map(() => ({
        height: Math.random() * 40 + 10
      }));
    }, 200);
  }

  // Inicia animação do vinil
  private startVinylAnimation() {
    setTimeout(() => {
      this.vinylPlaying = true;
    }, 1500);
  }

  // Alterna estado do vinil
  toggleVinyl() {
    this.vinylPlaying = !this.vinylPlaying;
  }
  
  // Copia chave PIX para a área de transferência
  copiarPix(chave: string) {
    navigator.clipboard.writeText(chave).then(() => {
      this.pixCopiado = chave;
      setTimeout(() => {
        this.pixCopiado = null;
      }, 2000);
      alert('Chave PIX copiada: ' + chave);
    }).catch(err => {
      console.error('Erro ao copiar PIX:', err);
    });
  }

  // Abre links
  openLink(url: string): void {
    let finalUrl = url;

    if (!url.startsWith('http://') &&
        !url.startsWith('https://') &&
        !url.startsWith('mailto:')) {
      finalUrl = 'https://' + url;
    }

    window.open(finalUrl, '_blank');
  }

  // Estilo do card
  getCardStyle(): { [key: string]: string } {
    const style: { [key: string]: string } = {};

    // PRIORIDADE 1: logoBackground
    if (this.data.logoBackground?.trim()) {
      if (this.isImageUrl(this.data.logoBackground)) {
        style['background-image'] = `url('${this.data.logoBackground}')`;
        style['background-size'] = 'cover';
        style['background-position'] = 'center';
        style['background-repeat'] = 'no-repeat';
      } else if (this.data.logoBackground.startsWith('#')) {
        style['background-color'] = this.data.logoBackground;
      } else if (this.isGradient(this.data.logoBackground)) {
        style['background'] = this.data.logoBackground;
      }
    }
    // PRIORIDADE 2: background
    else if (this.data.background?.trim()) {
      if (this.isImageUrl(this.data.background)) {
        style['background-image'] = `url('${this.data.background}')`;
        style['background-size'] = 'cover';
        style['background-position'] = 'center';
        style['background-repeat'] = 'no-repeat';
      } else if (this.data.background.startsWith('#')) {
        style['background-color'] = this.data.background;
      } else if (this.isGradient(this.data.background)) {
        style['background'] = this.data.background;
      } else {
        style['background-color'] = this.data.background;
      }
    }
    // PRIORIDADE 3: Fallback padrão (tema musical)
    else {
      style['background'] = 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
    }

    return style;
  }

  // Métodos auxiliares
  private isImageUrl(value: string): boolean {
    const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    return value.startsWith('http') ||
           value.startsWith('data:image') ||
           imagePattern.test(value);
  }

  private isGradient(value: string): boolean {
    return /(linear|radial|conic)-gradient/i.test(value);
  }



  getInitials(name: string | undefined): string {
    if (!name) return 'MÚSICA';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getTypeLabel(typePage: number): string {
    const types = {
      1: 'Artista Solo',
      2: 'Banda',
      3: 'DJ/Produtor',
      4: 'Cantor',
      5: 'Instrumentista'
    };
    return types[typePage as keyof typeof types] || 'Músico';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }
}

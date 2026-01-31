import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PageData } from '../../../models/page-data.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatIconModule],
  templateUrl: './music.html',
  styleUrl: './music.scss',
})
export class Music {
  @Input() data!: PageData;

  vinylPlaying = false;

  ngOnInit() {
    // Inicia animação do vinil após um delay
    setTimeout(() => {
      this.vinylPlaying = true;
    }, 1000);
  }
  getCardStyle(): string {
    let style = '';

    // PRIORIDADE 1: logoBackground (imagem)
    if (this.data.logoBackground && this.data.logoBackground.trim() !== '') {
      if (this.isImageUrl(this.data.logoBackground)) {
        // Se for URL de imagem
        style += `background-image: url('${this.data.logoBackground}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
      } else if (this.data.logoBackground.startsWith('#')) {
        // Se for cor hexadecimal
        style += `background-color: ${this.data.logoBackground};`;
      } else if (this.isGradient(this.data.logoBackground)) {
        // Se for gradiente
        style += `background: ${this.data.logoBackground};`;
      }
    }
    // PRIORIDADE 2: background (cor/gradiente/imagem geral)
    else if (this.data.background && this.data.background.trim() !== '') {
      if (this.isImageUrl(this.data.background)) {
        // Se for URL de imagem
        style += `background-image: url('${this.data.background}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
      } else if (this.data.background.startsWith('#')) {
        // Se for cor hexadecimal
        style += `background-color: ${this.data.background};`;
      } else if (this.isGradient(this.data.background)) {
        // Se for gradiente
        style += `background: ${this.data.background};`;
      } else {
        // Fallback padrão
        style += `background-color: ${this.data.background};`;
      }
    }
    // PRIORIDADE 3: Fallback padrão
    else {
      style += `background-color: #ffffff;`;
    }

    return style;
  }

  // Método auxiliar para verificar se é URL de imagem
  private isImageUrl(value: string): boolean {
    return value.startsWith('http') ||
           value.startsWith('data:image') ||
           value.includes('.jpg') ||
           value.includes('.jpeg') ||
           value.includes('.png') ||
           value.includes('.gif') ||
           value.includes('.webp');
  }

  // Método auxiliar para verificar se é gradiente
  private isGradient(value: string): boolean {
    return value.includes('linear-gradient') ||
           value.includes('radial-gradient') ||
           value.includes('conic-gradient');
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PageData } from '../../../models/page-data.model';

@Component({
  selector: 'app-template3',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './template3.html',
  styleUrl: './template3.scss',
})
export class Template3 {
  @Input() data!: PageData;

  // Adicione este método
  openLink(url: string): void {
    // Validação básica da URL
    let finalUrl = url;

    // Adiciona https:// se não tiver protocolo
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }

    // Abre em nova aba
    window.open(finalUrl, '_blank');
  }

  // ... o resto dos métodos permanece igual
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

import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PageData } from '../../../models/page-data.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-photographer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgOptimizedImage],
  templateUrl: './photographer.html',
  styleUrl: './photographer.scss',
})
export class Photographer {
  @Input() data!: PageData;
  flashEffect = false;
  currentYear = new Date().getFullYear();
  showBackgroundOverlay = true;

    ngOnInit() {
    // Efeito de flash periódico
    setInterval(() => {
      this.flashEffect = true;
      setTimeout(() => {
        this.flashEffect = false;
      }, 500);
    }, 10000);
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
  isImageUrl(value: string): boolean {
    if (!value) return false;
    return value.startsWith('http') ||
           value.startsWith('data:image') ||
           /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(value);
  }
  getBackgroundImageUrl(): string | null {
    if (this.data.logoBackground && this.isImageUrl(this.data.logoBackground)) {
      return this.data.logoBackground;
    }
    if (this.data.background && this.isImageUrl(this.data.background)) {
      return this.data.background;
    }
    return null;
  }
    getBackgroundPriority(): boolean {
    return true; // Background é sempre prioritário
  }
  // Método auxiliar para verificar se é gradiente
   isGradient(value: string): boolean {
    if (!value) return false;
    return value.includes('linear-gradient') ||
           value.includes('radial-gradient') ||
           value.includes('conic-gradient');
  }
  takePhoto(): void {
    this.flashEffect = true;
    setTimeout(() => {
      this.flashEffect = false;
    }, 500);
    

  }
  // Métodos auxiliares
  cleanUrl(url: string): string {
    if (!url) return '';
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  }

  cleanWhatsapp(number: string): string {
    if (!number) return '';
    return number.replace(/\D/g, '');
  }

  formatPhone(phone: string): string {
    const cleaned = this.cleanWhatsapp(phone);
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0,2)}) ${cleaned.substring(2,7)}-${cleaned.substring(7)}`;
    }
    return phone;
  }

  ensureHttp(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }
optimizeImageUrl(url: string, width: number = 1920, quality: number = 80): string {
    if (!url || !this.isImageUrl(url)) return url;
    
    // Para Cloudinary (exemplo)
    // if (url.includes('cloudinary.com')) {
    //   return this.optimizeCloudinaryUrl(url, width, quality);
    // }
    
    // Para outras URLs, você pode adicionar parâmetros de otimização
    // se o serviço suportar (como Imgix, ImageKit, etc.)
    
    return url;
  }
  // Método para otimizar imagens externas
private optimizeCloudinaryUrl(url: string, width: number, quality: number): string {
    // Transformações do Cloudinary
    const transformations = [
      `w_${width}`,
      `q_${quality}`,
      'c_fill',
      'f_auto' // Formato automático (webp se suportado)
    ].join(',');
    
    // Insere as transformações na URL do Cloudinary
    return url.replace(/\/upload\//, `/upload/${transformations}/`);
  }
  onBackgroundLoaded() {
  console.log('Background image loaded successfully');
  // Você pode adicionar lógica aqui, como remover o skeleton
}
onBackgroundError() {
  console.error('Failed to load background image');
  this.showBackgroundOverlay = false;
  
  // Fallback para cor sólida
  const fallbackStyle = this.getCardStyle();
  if (!fallbackStyle.includes('background-color')) {
    // Adiciona um fallback
    const card = document.querySelector('.card') as HTMLElement;
    if (card) {
      card.style.backgroundColor = '#1a1a1a';
    }
  }
}
onProfileImageError() {
  console.error('Failed to load profile image');
  // Pode mostrar o placeholder ou um fallback
  this.data.logo = ''; // Limpa a URL inválida
}
// Método para recarregar imagem (opcional)
reloadBackgroundImage() {
  const bgUrl = this.getBackgroundImageUrl();
  if (bgUrl) {
    // Força recarregamento adicionando timestamp
    const timestamp = new Date().getTime();
    const separator = bgUrl.includes('?') ? '&' : '?';
    this.data.logoBackground = `${bgUrl}${separator}t=${timestamp}`;
  }
}

}

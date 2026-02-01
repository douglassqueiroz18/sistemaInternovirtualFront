import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageData } from '../../../models/page-data.model';

@Component({
  selector: 'app-law',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './law.html',
  styleUrls: ['./law.scss']
})
export class Law implements OnInit {
  @Input() data!: PageData;

  // Configuração dos botões sociais baseados nos dados disponíveis
  socialButtons = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: 'phone',
      color: '#25D366',
      url: (value: string) => `https://wa.me/${value.replace(/\D/g, '')}`,
      tooltip: 'Enviar mensagem no WhatsApp'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: 'camera',
      color: '#E4405F',
      url: (value: string) => `https://instagram.com/${value}`,
      tooltip: 'Visitar perfil no Instagram'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: 'facebook',
      color: '#1877F2',
      url: (value: string) => `https://facebook.com/${value}`,
      tooltip: 'Visitar perfil no Facebook'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: 'linkedin',
      color: '#0A66C2',
      url: (value: string) => `https://linkedin.com/in/${value}`,
      tooltip: 'Ver perfil no LinkedIn'
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      icon: 'music',
      color: '#000000',
      url: (value: string) => `https://tiktok.com/@${value}`,
      tooltip: 'Ver perfil no TikTok'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: 'youtube',
      color: '#FF0000',
      url: (value: string) => `https://youtube.com/${value}`,
      tooltip: 'Visitar canal no YouTube'
    },
    {
      key: 'site',
      label: 'Site',
      icon: 'globe',
      color: '#6366F1',
      url: (value: string) => value,
      tooltip: 'Visitar site'
    },
    {
      key: 'email',
      label: 'E-mail',
      icon: 'mail',
      color: '#7C3AED',
      url: (value: string) => `mailto:${value}`,
      tooltip: 'Enviar e-mail'
    }
  ];

  // Filtra apenas os botões que têm dados
  activeButtons: any[] = [];

  ngOnInit() {
    // Filtra os botões que têm dados no PageData
    this.activeButtons = this.socialButtons.filter(button => {
      const value = this.data[button.key as keyof PageData];
      return value && value.toString().trim() !== '';
    });
  }

  // Método para abrir links
  openLink(url: string): void {
    let finalUrl = url;

    // Adiciona https:// se necessário (exceto para mailto:)
    if (!url.startsWith('http://') &&
        !url.startsWith('https://') &&
        !url.startsWith('mailto:')) {
      finalUrl = 'https://' + url;
    }

    window.open(finalUrl, '_blank');
  }

  // Estilo do cartão (mantém sua lógica original)
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
    // PRIORIDADE 3: Fallback padrão
    else {
      style['background'] = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    return style;
  }
// Método para obter iniciais do nome
  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Método para obter label do tipo de página
getTypeLabel(typePage: number): string {
  const types = {
    1: 'Pessoal',
    2: 'Profissional',
    3: 'Empresarial',
    4: 'Medic'
  };
  return types[typePage as keyof typeof types] || `Tipo ${typePage}`;
}
  // Método auxiliar para verificar se é URL de imagem
  public isImageUrl(value: string): boolean {
    const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    return value.startsWith('http') ||
           value.startsWith('data:image') ||
           imagePattern.test(value);
  }

  // Método auxiliar para verificar se é gradiente
  private isGradient(value: string): boolean {
    return /(linear|radial|conic)-gradient/i.test(value);
  }
  // Adicione estes métodos à classe LawComponent





}

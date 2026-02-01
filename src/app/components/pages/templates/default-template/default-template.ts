import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-default-template',
  standalone: true,
  imports: [CommonModule, MatIconModule ],
  templateUrl: './default-template.html',
  styleUrls: ['./default-template.scss']
})
export class DefaultTemplate implements OnInit {
  @Input() data: any = {};
showEmbeddedMap = true; // Controla se mostra o mapa embed
  ngOnInit() {
    // Inicializa dados padrão se vazio
    if (!this.data || Object.keys(this.data).length === 0) {
      this.data = {
        nomeCartao: 'Seu Nome',
        descricao: 'Conecte-se comigo nas redes sociais!'
      };
    }
  }

  getCardStyle() {
    let style = '';

    // Background com imagem
    if (this.data.logoBackground) {
      style += `background-image: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('${this.data.logoBackground}'); `;
      style += `background-size: cover; background-position: center; background-attachment: fixed; `;
    }
    // Background com cor
    else if (this.data.background) {
      style += `background-color: ${this.data.background}; `;
    }
    // Background padrão
    else {
      style += `background-color: #f5f5f5; `;
    }

    return style;
  }

getInitials(name: string = ''): string {
  // Adicione esta verificação
  if (!name) return '?';

  // Já existe:
  if (!name.trim()) return '?';

  const words = name.split(' ');
  const initials = words.map(word => word[0]?.toUpperCase() || '');

  if (initials.length >= 2) {
    return `${initials[0]}${initials[initials.length - 1]}`;
  }

  return initials[0] || '?';
}

  formatWhatsApp(phone: string): string {
    if (!phone) return '';
    // Remove tudo que não é número
    return phone.replace(/\D/g, '');
  }

  formatPhone(phone: string): string {
    if (!phone) return '';

    const numbers = phone.replace(/\D/g, '');

    // Formata para (XX) XXXXX-XXXX
    if (numbers.length === 11) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    }

    // Formata para (XX) XXXX-XXXX
    if (numbers.length === 10) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    }

    return phone;
  }

  hasAdditionalInfo(): boolean {
    return !!(this.data.estado || this.data.cidade || this.data.telefone);
  }

  // Método para abrir links
  openLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
  getGoogleMapsUrl(address: string): string {
  if (!address) return '#';
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
getMapEmbedUrl(address: string): string {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=SUA_CHAVE_API&q=${query}&zoom=15`;
}
copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).then(() => {
    // Mostrar toast de sucesso
    alert('Endereço copiado!');
  });
}
}

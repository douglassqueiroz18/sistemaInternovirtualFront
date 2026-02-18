import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject, Pipe, PipeTransform } from '@angular/core'; // Adicione OnInit e inject
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeStyle, SafeResourceUrl  } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router'; // Importe o ActivatedRoute
import { TempStorageService } from '../../../services/temp-storage-service';
import { PageData } from '../../models/page-data.model';
import { catchError, debounceTime, distinctUntilChanged, filter, of, Subject } from 'rxjs';
import { timeout } from 'rxjs';
// ... seus outros imports

@Component({
  selector: 'app-edit-page',
  standalone: true, // Garanta que está como standalone se for o caso
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './edit-page.html',
  styleUrl: './edit-page.scss',
})
export class EditPage implements OnInit {
  serialKey: string = '';
  pageData: PageData | null = null;
  loaded: boolean = false;
  loading: boolean = false;
  tempFile: File | null = null; // Armazena o arquivo temporariamente
  tempBackgroundFile: File | null = null;
  showFullBackground: boolean = false;
  isFullscreenPreview: boolean = false;
  logoBackgroundBlobUrl: string | null = null;
  originalBackground: string = '';
  backgroundHasChanged: boolean = false;
  gettingLocation = false;
  showMapEmbed = false;
  gradientPresets = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #FF6B6B, #FFE66D)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #36D1DC, #5B86E5)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #56AB2F, #A8E063)' },
  { name: 'Lavender', value: 'linear-gradient(135deg, #8E2DE2, #4A00E0)' },
  { name: 'Coral', value: 'linear-gradient(135deg, #FF5F6D, #FFC371)' },
  { name: 'Sky', value: 'linear-gradient(135deg, #00C9FF, #92FE9D)' },
  { name: 'Berry', value: 'linear-gradient(135deg, #FF5E62, #FF9966)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #00B09B, #96C93D)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #FF086E, #FF8C8C)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)' },
  { name: 'Desert', value: 'linear-gradient(135deg, #C02425, #F0CB35)' },
  { name: 'Iris', value: 'linear-gradient(135deg, #5D26C1, #A17FE0)' }
  ];
  // Variáveis para gradiente customizado
  showCustomGradient: boolean = false;
  customColor1: string = '#FF6B6B';
  customColor2: string = '#FFE66D';
  gradientAngle: number = 135;
  customGradientValue: string = '';
  // Injeções modernas
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private tempStorage = inject(TempStorageService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private saveSubject = new Subject<void>();

  ngOnInit(): void {
    // 1. Pega o serial da URL (configurada como /edit/:serialKey)
    const keyFromUrl = this.route.snapshot.paramMap.get('serialKey');

    if (keyFromUrl) {
      this.serialKey = keyFromUrl;
      this.loadPage(); // 2. Carrega os dados automaticamente
    }
    this.updateCustomGradient();
      this.saveSubject.pipe(
      debounceTime(2000), // Aguarda 2 segundos sem alterações
      distinctUntilChanged()
    ).subscribe(() => {
      // Auto-save opcional
      // this.autoSave();
    });
  }
  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  loadPage() {
  if (!this.serialKey) return;

  this.loading = true;
  this.pageData = null;

  const url = `https://virtualnfc.com/pagina/${this.serialKey}`;

  // Usar pipe com operadores RxJS para otimizar
  this.http.get<PageData>(url).pipe(
    // Adicionar timeout para não ficar travado em conexões lentas
    timeout(30000),
    // Tratar erros de forma mais elegante
    catchError((error) => {
      console.error('Falha na API:', error);
      this.loading = false;
      this.loaded = true;
      this.showError('Falha ao carregar dados. Verifique sua conexão.');
      return of(null); // Retorna observable vazio
    }),
    // Filtrar dados nulos
    filter(data => data !== null)
  ).subscribe({
    next: (data) => {
      this.pageData = data;

      // Carregar do localStorage de forma assíncrona para não bloquear
      setTimeout(() => {
        const tempLogo = localStorage.getItem(`temp_logo_${this.serialKey}`);
        if (tempLogo && this.pageData) {
          try {
            const tempData = JSON.parse(tempLogo);
            this.pageData.logo = tempData.base64;
          } catch (e) {
            console.error('Erro ao parsear logo do localStorage:', e);
          }
        }

        this.loaded = true;
        this.loading = false;
        this.cdr.detectChanges();
      }, 0);
    }
  });
}
  // Adicione 'logo' no PageData se ainda não existir no seu modelo
  // No método loadPage, certifique-se de que pageData.logo receba a URL do banco
  onBackgroundSelected(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  // Tipos aceitos
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const minSize = 150 * 1024;      // 150KB → evita baixa qualidade

  // Mínimos de qualidade
  const minWidth = 900;          // aceita 1152px, mas permite similares
  const minHeight = 600;         // aceita 768px, mas permite similares
  const minRatio = 1.4;          // proporcional a 3:2
  const maxRatio = 1.6;

  // Tipo
  if (!validTypes.includes(file.type)) {
    alert('Formato inválido. Use JPEG, PNG ou WEBP.');
    return;
  }

  // Tamanho do arquivo
  if (file.size > maxSize) {
    alert('Imagem maior que 5MB.');
    return;
  }

  if (file.size < minSize) {
    alert('Imagem muito comprimida. Qualidade insuficiente.');
    return;
  }

  // Validação das dimensões
  const img = new Image();
  img.onload = () => {
    const ratio = img.width / img.height;

    // Resolução mínima
    if (img.width < minWidth || img.height < minHeight) {
      alert(`Use pelo menos ${minWidth}×${minHeight}px.`);
      return;
    }

    // Proporção flexível
    if (ratio < minRatio || ratio > maxRatio) {
      alert('Proporção inadequada. Use algo próximo de 3:2.');
      return;
    }

    // Se passou, a imagem é adequada

    // Limpa blob anterior
    if (this.logoBackgroundBlobUrl) {
      URL.revokeObjectURL(this.logoBackgroundBlobUrl);
    }

    this.logoBackgroundBlobUrl = URL.createObjectURL(file);
    this.tempBackgroundFile = file;

    // Preview base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.pageData) {
        this.pageData.logoBackground = e.target.result;

        localStorage.setItem(
          `temp_logoBackground_${this.serialKey}`,
          JSON.stringify({
            base64: e.target.result,
            fileName: file.name,
            fileType: file.type,
            timestamp: Date.now(),
          }),
        );

        this.cdr.detectChanges();
      }
    };
    reader.readAsDataURL(file);
  };

  img.src = URL.createObjectURL(file);
}


  // No ngOnDestroy (importante para liberar memória)
  ngOnDestroy(): void {
    if (this.logoBackgroundBlobUrl) {
      URL.revokeObjectURL(this.logoBackgroundBlobUrl);
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    // Validação
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      alert('Tipo de arquivo inválido. Use apenas imagens (JPEG, PNG, GIF, WEBP, SVG)');
      return;
    }
    if (file.size > maxSize) {
      alert('Arquivo muito grande. Máximo 5MB');
      return;
    }
    if (file) {
      // 1. Criar preview local imediato (Base64)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.pageData) {
          this.pageData.logo = e.target.result; // Preenche a div instantaneamente
          // Salva no localStorage para persistir
          localStorage.setItem(
            `temp_logo_${this.serialKey}`,
            JSON.stringify({
              base64: e.target.result,
              fileName: file.name,
              fileType: file.type,
              timestamp: Date.now(),
            }),
          );
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  }
  removeTempLogo(event?: Event): void {
    if(event){
      event.stopPropagation();
    }
    if (this.pageData) {
      this.pageData.logo = null;
      this.tempFile = null;
      localStorage.removeItem(`temp_logo_${this.serialKey}`);
      this.cdr.detectChanges();
    }
  }
  getLogoStyle(): SafeStyle {
  if (!this.pageData?.logo || this.pageData.logo === 'null' || this.pageData.logo === '') {
      return this.sanitizer.bypassSecurityTrustStyle('none');
  }
  return this.sanitizer.bypassSecurityTrustStyle(`url('${this.pageData.logo}')`);
  }
  getBackgroundStyle(): string {
      // Se tem arquivo temporário, gera blob URL uma vez
  if (this.tempBackgroundFile && !this.logoBackgroundBlobUrl) {
    this.logoBackgroundBlobUrl = URL.createObjectURL(this.tempBackgroundFile);
  }

  // Se tem logoBackground do servidor
  if (this.pageData?.logoBackground) {
    if (this.pageData.logoBackground.startsWith('http')) {
      return `url('${this.pageData.logoBackground}') center/cover no-repeat fixed`;
    } else if (this.pageData.logoBackground.startsWith('#')) {
      return this.pageData.logoBackground;
    }
  }
    // Se tem blob URL temporário
  if (this.logoBackgroundBlobUrl) {
    return `url('${this.logoBackgroundBlobUrl}') center/cover no-repeat fixed`;
  }

  return 'none';
  }

  hasBackgroundImage(): boolean {

    // Verifica se tem imagem temporária OU logoBackground do banco
    return !!this.tempBackgroundFile ||
          !!(this.pageData?.logoBackground && this.pageData.logoBackground.startsWith('http'));
  }

  public savePageData() {
  if (!this.pageData) return;
  let hasBackground = this.pageData.background && this.pageData.background.trim() !== '';
  let hasLogoBackground = this.pageData.logoBackground && this.pageData.logoBackground.trim() !== '';
  let hasTempBackground = !!this.tempBackgroundFile;

  if ((hasBackground || hasTempBackground) && hasLogoBackground) {
    this.showError('Você só pode ter um fundo por vez: fundo da página OU fundo do logo. Remova um deles.');

    return;
  }
    this.loading = true;
    const urlEdit = `https://virtualnfc.com/pagina/${this.serialKey}`;
    this.http.put(urlEdit, this.pageData).subscribe({
      next: () => {
        alert('Página salva com sucesso!');
        this.loading = false;
      },
      error: (error) => {
        alert('Erro ao salvar página.');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('Requisição de salvamento concluída.');
      }
    });
  }
  // No método que remove o logoBackground temporário
  removeTempBackground(): void {
    if (this.logoBackgroundBlobUrl) {
      URL.revokeObjectURL(this.logoBackgroundBlobUrl); // Libera memória
      this.logoBackgroundBlobUrl = null;
      this.cdr.detectChanges();

    }
    this.tempBackgroundFile = null;
  }
  // Método para remover imagem de logoBackground existente
  removeBackgroundImage() {
    this.removeTempBackground();
    if (this.pageData && this.pageData.logoBackground.startsWith('http')) {
      // Aqui você poderia chamar um endpoint para deletar a imagem do servidor
      this.pageData.logoBackground = '';
      this.removeTempBackground();
      this.cdr.detectChanges();
    }
  }
  toggleBackgroundPreview() {
    this.showFullBackground = !this.showFullBackground;
  }
  getPageBackground(): string {
    if (!this.pageData?.logoBackground) return '';

    if (this.showFullBackground || this.isFullscreenPreview) {
      if (this.pageData.logoBackground.startsWith('#')) {
        return this.pageData.logoBackground;
      } else {
        return `url('${this.pageData.logoBackground}')`;
      }
    }

    return '';
  }
  toggleFullscreenPreview() {
    this.isFullscreenPreview = !this.isFullscreenPreview;
    if (this.isFullscreenPreview) {
      document.body.classList.add('fullscreen-preview');
    } else {
      document.body.classList.remove('fullscreen-preview');
    }
  }
  onBackgroundChanged() {
    if (this.pageData?.logoBackground) {
      // Se for uma cor hexadecimal, mostra preview
      if (this.pageData.logoBackground.startsWith('#')) {
        this.showFullBackground = true;
      }
      this.cdr.detectChanges();
    }
  }
  // Selecionar gradiente pré-definido
selectGradient(gradient: string): void {
  if (this.pageData) {
    this.pageData.background = gradient;
    // Remove arquivo temporário se existir
    if (this.tempBackgroundFile) {
      this.tempBackgroundFile = null;
    }

  }
}

// Atualizar preview do gradiente customizado
updateCustomGradient(): void {
  this.customGradientValue = `linear-gradient(${this.gradientAngle}deg, ${this.customColor1}, ${this.customColor2})`;
  console.log('customGradientValue:', this.customGradientValue);
  this.cdr.detectChanges();

}

// Aplicar gradiente customizado
applyCustomGradient(): void {
  if (this.pageData) {
    this.pageData.background = this.customGradientValue;
    // Remove arquivo temporário se existir
    if (this.tempBackgroundFile) {
      this.tempBackgroundFile = null;
    }
    this.showCustomGradient = false;
     this.snackBar.open('Gradiente aplicado localmente. Clique em "Salvar Todas as Alterações" para confirmar.', 'OK', {
      duration: 3000
    });
  }
}

// Verificar se é gradiente
isGradient(value: string): boolean {
  return value?.includes('linear-gradient') || value?.includes('radial-gradient');
}
getColorFromBackground(): string {
  if (this.pageData?.background?.startsWith('#')) {
    return this.pageData.background;
  }
  return '#FFFFFF'; // Cor padrão
}
// Quando o usuário seleciona cor no picker
onColorPickerChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const color = input.value;

  if (this.pageData) {
    this.pageData.background = color;
  }
}
removeBackground(): void {
  // Remove cor/gradiente do campo
  if (this.pageData) {
    this.pageData.background = '';
  }

  // Remove arquivo temporário de imagem
  if (this.tempBackgroundFile) {
    this.tempBackgroundFile = null;
  }

  // Limpa editor de gradiente
  this.showCustomGradient = false;

  // Atualiza visualização
  this.cdr.detectChanges();
}
toggleCustomGradient(event: Event): void {
  event.preventDefault(); // Previne o comportamento padrão
  event.stopPropagation(); // Para a propagação do evento
  this.showCustomGradient = !this.showCustomGradient;
}
formatSpotifyUrl() {
  // Optional chaining para segurança total
  if (!this.pageData?.spotify?.trim()) return;

  const spotifyValue = this.pageData.spotify.trim();

  // Se já começa com http, não faz nada
  if (spotifyValue.startsWith('http')) return;

  // Se parece com ID do Spotify, converte para URL
  const spotifyIdMatch = spotifyValue.match(/^([0-9a-zA-Z]{22})/);
  if (spotifyIdMatch) {
    this.pageData.spotify = `https://open.spotify.com/artist/${spotifyIdMatch[1]}`;
    return;
  }

  // Adiciona https:// se for um domínio
  this.pageData.spotify = `https://${spotifyValue}`;
}
openGoogleMaps(): void {
  if (this.pageData?.maps) {
    const query = encodeURIComponent(this.pageData.maps);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }
}
getCurrentLocation(): void {
  this.gettingLocation = true;

  if (!navigator.geolocation) {
    alert('Geolocalização não suportada pelo navegador');
    this.gettingLocation = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Usar Geocoding reverso para obter endereço
      this.reverseGeocode(latitude, longitude);
    },
    (error) => {
      console.error('Erro na geolocalização:', error);
      this.gettingLocation = false;
      alert('Não foi possível obter a localização. Digite o endereço manualmente.');
    },
    { timeout: 10000 }
  );
}
async reverseGeocode(lat: number, lng: number): Promise<void> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await response.json();

    if (data.display_name) {
      this.pageData!.maps = data.display_name;
      this.cdr.detectChanges();
    }
  } catch (error) {
    console.error('Erro no geocoding:', error);
    // Fallback: usar coordenadas
    this.pageData!.maps = `${lat}, ${lng}`;
  } finally {
    this.gettingLocation = false;
  }
}
getMapEmbedUrl(): SafeResourceUrl | string {
  if (!this.pageData?.maps) return '';

  const query = encodeURIComponent(this.pageData.maps);
  const url = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${query}`;

  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
// Pipe SafeUrl (crie um pipe se não tiver)

}

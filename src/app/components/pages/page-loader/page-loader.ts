import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../page';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../endpoints';
import { DefaultTemplate } from '../templates/default-template/default-template';
import { Music } from '../templates/music/music';
import { ActivatedRoute } from '@angular/router';
import { PageData } from '../../models/page-data.model';
import { Photographer } from '../templates/photographer/photographer';
import { Law } from '../templates/law/law';
import { Medic } from '../templates/medic/medic';

@Component({
  selector: 'app-page-loader',
  imports: [CommonModule, DefaultTemplate, Music, Photographer, Law, Medic],
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.scss',
})
export class PageLoader implements OnInit {
  pageData: PageData | null = null;
  selectedTemplate: number = 0;
  private cdr = inject(ChangeDetectorRef); // Injeta o detector
  constructor(private pageService: Page, private http: HttpClient, private route: ActivatedRoute) {}


ngOnInit(){
  this.loadPageData();
}
  loadPageData() {
  const serialKey = this.route.snapshot.paramMap.get('serialKey');
  const url = `http://localhost:8080/pagina/${serialKey}`;

  this.http.get<PageData | PageData[]>(url).subscribe(data => {
    if (data) {
      // 1. Define se é array ou objeto único
      if (Array.isArray(data)) {
        this.pageData = serialKey ? data.find(p => p.serialKey === serialKey) || data[0] : data[0];
      } else {
        this.pageData = data;
      }

      // 2. Define o template com base no que veio do banco
      if (this.pageData) {
        // CONVERTE PARA NÚMERO SE FOR STRING
        const typePage = Number(this.pageData.typePage);
        this.selectedTemplate = this.pageService.getTemplate(typePage);
        this.cdr.detectChanges();

        // DEBUG: Adicione um log para verificar
        console.log('typePage do backend:', this.pageData.typePage);
        console.log('typePage convertido:', typePage);
        console.log('selectedTemplate:', this.selectedTemplate);
      }
    }
  });
}
}

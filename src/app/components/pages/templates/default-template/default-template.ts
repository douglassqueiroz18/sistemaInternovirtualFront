import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageData } from '../../../models/page-data.model';

@Component({
  selector: 'app-default-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-template.html',
  styleUrl: './default-template.scss',
})
export class DefaultTemplate {
  @Input() data!: PageData;

  getCardStyle() {
    let style = '';
    if (this.data.logoBackground) {
      style += `background-image: url(${this.data.logoBackground}); background-size: cover; background-position: center; `;
    } else {
      style += `background-color: ${this.data.background || '#fff'}; `;
    }
    return style;
  }
}

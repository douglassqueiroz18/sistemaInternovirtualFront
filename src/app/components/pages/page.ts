import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Page {
  getTemplate(typePage: number): number {
    if (!typePage) {
      return 0;
    }
    switch (typePage) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      default:
        return 0;
    }
  }
}

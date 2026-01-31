import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessarPagina } from './acessar-pagina';

describe('AcessarPagina', () => {
  let component: AcessarPagina;
  let fixture: ComponentFixture<AcessarPagina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcessarPagina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcessarPagina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

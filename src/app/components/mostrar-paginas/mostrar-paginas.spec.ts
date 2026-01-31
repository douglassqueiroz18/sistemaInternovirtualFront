import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarPaginas } from './mostrar-paginas';

describe('MostrarPaginas', () => {
  let component: MostrarPaginas;
  let fixture: ComponentFixture<MostrarPaginas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarPaginas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarPaginas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

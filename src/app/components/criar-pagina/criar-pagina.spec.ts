import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagina } from './criar-pagina';

describe('Pagina', () => {
  let component: Pagina;
  let fixture: ComponentFixture<Pagina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pagina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medic } from './medic';

describe('Medic', () => {
  let component: Medic;
  let fixture: ComponentFixture<Medic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Medic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

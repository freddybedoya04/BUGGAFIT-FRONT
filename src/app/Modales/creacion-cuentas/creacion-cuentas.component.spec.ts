import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCuentasComponent } from './creacion-cuentas.component';

describe('CreacionCuentasComponent', () => {
  let component: CreacionCuentasComponent;
  let fixture: ComponentFixture<CreacionCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionCuentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

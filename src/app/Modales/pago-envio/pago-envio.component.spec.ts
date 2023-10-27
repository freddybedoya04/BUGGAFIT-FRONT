import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEnvioComponent } from './pago-envio.component';

describe('PagoEnvioComponent', () => {
  let component: PagoEnvioComponent;
  let fixture: ComponentFixture<PagoEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoEnvioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

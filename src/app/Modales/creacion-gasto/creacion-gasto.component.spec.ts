import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionGastoComponent } from './creacion-gasto.component';

describe('CreacionGastoComponent', () => {
  let component: CreacionGastoComponent;
  let fixture: ComponentFixture<CreacionGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionGastoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

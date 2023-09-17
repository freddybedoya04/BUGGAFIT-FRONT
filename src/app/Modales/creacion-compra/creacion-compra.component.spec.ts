import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCompraComponent } from './creacion-compra.component';

describe('CreacionCompraComponent', () => {
  let component: CreacionCompraComponent;
  let fixture: ComponentFixture<CreacionCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionCompraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

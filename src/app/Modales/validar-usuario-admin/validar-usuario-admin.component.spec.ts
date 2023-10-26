import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarUsuarioAdminComponent } from './validar-usuario-admin.component';

describe('ValidarUsuarioAdminComponent', () => {
  let component: ValidarUsuarioAdminComponent;
  let fixture: ComponentFixture<ValidarUsuarioAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarUsuarioAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarUsuarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

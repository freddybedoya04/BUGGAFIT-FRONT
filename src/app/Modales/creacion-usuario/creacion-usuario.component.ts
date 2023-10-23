import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Iusuario } from 'src/app/Interfaces/iusuario';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.scss'],
})
export class CreacionUsuarioComponent implements OnInit {
  formularioUsuario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private usuarioService: UsuarioService,
    public ref: DynamicDialogRef
  ) {
    this.formularioUsuario = this.formBuilder.group({
      USU_NOMBRE: [null, Validators.required],
      USU_CEDULA: [null, Validators.required],
      USU_ROL: [null, Validators.required],
      USU_CONTRASEÑA: [null, Validators.required],
    });
  }

  ngOnInit() {}

  AgregarUsuario() {
    const usuario: Iusuario = {
      USU_CEDULA: this.formularioUsuario.get('USU_CEDULA')?.value,
      USU_NOMBRE: this.formularioUsuario.get('USU_NOMBRE')?.value,
      USU_ROL: this.formularioUsuario.get('USU_ROL')?.value,
      USU_CONTRASEÑA: this.formularioUsuario.get('USU_CONTRASEÑA')?.value,
      USU_FECHACREACION: new Date(),
      USU_FECHAACTUALIZACION: new Date(),
      USU_ESTADO: true,
    };

    this.alerta.showLoading('Creando nuevo usuario');
    this.usuarioService.AgregarUsuario(usuario).subscribe(
      (result) => {
        this.alerta.hideLoading();
        this.alerta.SetToast('Usuario creado', 1);
        this.CerradoPantalla();
      },
      (err) => {
        this.alerta.hideLoading();
        const errorMessage = err && err.message ? err.message : 'Error al crear el usuario.';
        this.alerta.SetToast(errorMessage, 3);
        console.error(err);
      }
    );
  }

  CerradoPantalla() {
    this.LimpiarPantalla();
    this.ref.close();
  }

  LimpiarPantalla() {
    this.formularioUsuario.reset();
  }
}

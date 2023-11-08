import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef,DynamicDialogConfig} from 'primeng/dynamicdialog';
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
  esEdicion: boolean = false;
  usuarioAEditar: Iusuario |null = null;
  listaTipoDeRol:SelectItem[]=[]
  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private usuarioService: UsuarioService,
    public ref: DynamicDialogRef,
    public config:DynamicDialogConfig
  ) {
    this.formularioUsuario = this.formBuilder.group({
      USU_NOMBRE: [null, Validators.required],
      USU_CEDULA: [null, Validators.required],
      USU_CONTRASEÑA: [null],
      USU_ROL:[null, Validators.required],
    });
    this.usuarioAEditar={ 
      USU_NOMBRE:'',
      USU_CEDULA:'',
      USU_ROL:'',
      USU_CONTRASEÑA:'',
      USU_FECHACREACION: new Date(),
      USU_FECHAACTUALIZACION: new Date(),
      USU_ESTADO: false,

    }
  }

  ngOnInit() {
    this.ListarPerfiles();
    this.CargarDatos();

  }
  SubmitFormulario() {
    if (this.esEdicion) {
      this.EditarUsuario();
    }
    else {
      this.AgregarUsuario();
    }
  }
  EditarUsuario() {
    for (const control in this.formularioUsuario.controls) {
      if (this.formularioUsuario.controls[control].invalid) {
        this.alerta.SetToast(`El campo ${control.split('_')[1]} está incompleto`, 2);
        return;
      }
    }
  
    const cedulaUsuario: string = this.formularioUsuario.get('USU_CEDULA')?.value;
  
    this.usuarioService.BuscarUsuarioPorCedula(cedulaUsuario).subscribe(
      (usuarioExistente) => {
        if (usuarioExistente) {
          let usuarioEditado: Iusuario = {
            USU_CEDULA: cedulaUsuario,
            USU_NOMBRE: this.formularioUsuario.get('USU_NOMBRE')?.value,
            USU_ROL: this.formularioUsuario.get('USU_ROL')?.value,
            USU_FECHACREACION: new Date(),
            USU_FECHAACTUALIZACION: new Date(),
            USU_ESTADO: true,
          };
  
          // Verificar si se proporcionó una nueva contraseña
          const nuevaContrasena = this.formularioUsuario.get('USU_CONTRASEÑA')?.value;
          if (nuevaContrasena) {
            usuarioEditado.USU_CONTRASEÑA = nuevaContrasena;
          }
  
          this.alerta.showLoading('Editando usuario');
  
          this.usuarioService.ActualizarUsuario(usuarioEditado).subscribe(
            (result) => {
              this.alerta.hideLoading();
              this.alerta.SetToast('Usuario editado', 1);
              this.CerradoPantalla();
            },
            (err) => {
              this.alerta.hideLoading();
              const errorMessage = err && err.message ? err.message : 'Error al editar el usuario.';
              this.alerta.SetToast(errorMessage, 3);
              console.error(err);
            }
          );
        } else {
          this.alerta.SetToast('No se encontró el usuario que deseas editar.', 2);
        }
      },
      (error) => {
        this.alerta.SetToast('Error al buscar el usuario para edición.', 3);
        console.error(error);
      }
    );
  }
  AgregarUsuario() {
    if (this.formularioUsuario.get('USU_CONTRASEÑA')?.value === null) {
      this.alerta.SetToast('La contraseña es requerida para agregar un nuevo usuario.', 2);
      return;
    }
  
    const cedula = this.formularioUsuario.get('USU_CEDULA')?.value;
  
    const usuario: Iusuario = {
      USU_CEDULA: cedula,
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
        this.alerta.SetToast(err, 3);
        console.log(err);
      }
    );
  }
  
  
  CargarDatos(){
    this.esEdicion=this.config.data.esEdicion;
    this.usuarioAEditar=this.config.data.usuarioAEditar
    if(this.esEdicion){
      this.formularioUsuario.get('USU_CEDULA')?.disable();
      this.formularioUsuario.get('USU_CEDULA')?.setValue(this.usuarioAEditar?.USU_CEDULA);
      this.formularioUsuario.get('USU_NOMBRE')?.setValue(this.usuarioAEditar?.USU_NOMBRE);
      this.formularioUsuario.get('USU_ROL')?.setValue(this.usuarioAEditar?.USU_ROL);
    }

  }
  ListarPerfiles() {
    this.usuarioService.ListarPerfiles().subscribe((result: any) => {
      this.listaTipoDeRol = result.map((item: any) => {
        const selectItem: SelectItem = {
          label: item.PER_NOMBRE,
          value: item.PER_CODIGO
        }
        return selectItem;
      });
    });
  }
  CerradoPantalla() {
    this.LimpiarPantalla();
    this.ref.close();
  }

  LimpiarPantalla() {
    this.formularioUsuario.reset();
  }
}

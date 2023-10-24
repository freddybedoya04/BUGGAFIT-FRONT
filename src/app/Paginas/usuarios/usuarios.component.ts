import { Component, OnInit } from '@angular/core';
import { CreacionUsuarioComponent } from 'src/app/Modales/creacion-usuario/creacion-usuario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Icompras } from 'src/app/Interfaces/icompra';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { Iusuario } from 'src/app/Interfaces/iusuario';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  ListaUsuario:Iusuario[]=[];


constructor(public dialogService: DialogService, private UsuarioService: UsuarioService, private alertasService: AlertasService){

}
ngOnInit(): void {
  this.ListarUsuarios();
    
}

AbrirModalUsuario(){
  let ref = this.dialogService.open(CreacionUsuarioComponent, {
    header: 'Nuevo Usuario',
    width: '60%',
    contentStyle: { overflow: 'auto','background-color':'#eff3f8'  },
    baseZIndex: 100,
    maximizable: true,
    data:{esEdicion:false}
  });
  ref.onClose.subscribe((res) => {
    debugger;
    this.ListarUsuarios();
  });
  }
  EliminarUsuario(usuario: Iusuario) {
    this.alertasService.confirmacion("¿Desea eliminar al usuario con cédula: " + usuario.USU_CEDULA + "?").then((resolve: any) => {
      if (resolve) {
        this.alertasService.showLoading('Eliminando el usuario');
        this.UsuarioService.EliminarUsuario(usuario.USU_CEDULA).subscribe(
          (result) => {
            if (result == null || result?.StatusCode.toString().indexOf('20') >= 0) {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Usuario Eliminado', 1);
              this.ListarUsuarios(); // Vuelve a cargar la lista de usuarios después de eliminar
            } else {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al eliminar el usuario: ' + result?.message, 3);
              console.error(result);
            }
          }
        );
      }
    });
  }
  EditarUsuario(usuario: Iusuario){
    let ref=this.dialogService.open(CreacionUsuarioComponent,{
      header: 'Editar Usuario',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: true, productoAEditar: usuario }
    });
    ref.onClose.subscribe((res) => {
      this.ListarUsuarios();
    });
  };
  ListarUsuarios() {
    this.UsuarioService.ListarUsuarios().subscribe(
      (result: any) => {
        if (!result || result === null) {
          this.alertasService.SetToast("No hay usuarios para mostrar", 2);
          return;
        }
        this.ListaUsuario= result;
      });
  
  }
}


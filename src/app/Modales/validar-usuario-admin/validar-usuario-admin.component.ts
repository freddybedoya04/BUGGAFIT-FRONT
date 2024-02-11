import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILogin } from 'src/app/Interfaces/ilogin';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-validar-usuario-admin',
  templateUrl: './validar-usuario-admin.component.html',
  styleUrls: ['./validar-usuario-admin.component.scss']
})
export class ValidarUsuarioAdminComponent {

  credencialesDeAcceso: ILogin = {
    Cedula: '',
    Password: ''
  }
  constructor(
    private usuarioService: UsuarioService,
    private ventasService: VentasService,
    private alerta: AlertasService,
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef,
  ){

  }

  Validar(){
    this.alerta.showLoading("Validando Código");
    this.ventasService.getConfig().subscribe((result: any) => {
      this.alerta.hideLoading();
      if(result.CodigoDescuento==this.credencialesDeAcceso.Cedula){
        this.alerta.SetToast("Código valido",1);
        this.ref.close(true);
      }
      else{
        this.alerta.SetToast("Código inválido", 3);
        // this.ref.close(false);
      }
    });
  }

}

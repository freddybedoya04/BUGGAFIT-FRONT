import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CreacionCuentasComponent } from 'src/app/Modales/creacion-cuentas/creacion-cuentas.component';
import { IFiltro } from 'src/app/Interfaces/ifiltro';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent  {
  public searchKeyword: string = '';
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
constructor(
  private dialogService:DialogService
) {
  this.FechaFin = new Date();
  this.FechaInicio = new Date();
  this.filtro = {
    FechaFin: "",
    FechaInicio: ""
  }
}

ngOnInit() {
  this.ConfigurarFechas();

}

ConfigurarFechas() {
  this.FechaFin = new Date();
  this.FechaInicio = new Date(this.FechaFin)
  this.FechaInicio.setDate(this.FechaInicio.getDate() - 30);
}
  BorrarCuenta(){

  }
 
  AbrirModalCuenta(){
    let ref = this.dialogService.open(CreacionCuentasComponent, {
      header: '',
      width: '60%',
      contentStyle: { overflow: 'auto','background-color':'#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: false}
    });
 
  
  };
  }


import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { IGasto } from 'src/app/Interfaces/igasto';
import { CreacionGastoComponent } from 'src/app/Modales/creacion-gasto/creacion-gasto.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { GastosService } from 'src/app/Servicios/gastos.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  listaGastos: IGasto[] = [];
  public searchKeyword: string = '';


  constructor(
    private dialogService: DialogService,
    private alertasService: AlertasService,
    private gastosService: GastosService,
  ) {
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
    }

  }
  ngOnInit() {
    //this.BuscarGasto();
  }
  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
  }

  AbrirModalGastos() {
    let ref = this.dialogService.open(CreacionGastoComponent, {
      header: 'Nuevo Gasto',
      width: '60%',
      contentStyle: { overflow: 'auto','background-color':'#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: false}
    });
    ref.onClose.subscribe((res) => {

      this.BuscarGasto();
    });
  };

  BuscarGasto() {
    this.gastosService.BuscarGastos().subscribe((result: any) => {
      if (!result || result === null) {// en caso que llege vacio el gasto
        // Agregar mensaje de error
        this.alertasService.SetToast("No hay gastos para mostrar.", 2);
        return;
      }
      this.listaGastos = result.map((item: IGasto) => {
        return item;
      });
    });
  }

  BuscarComprasPorFechas() {
    this.ArmarFiltro();
    this.alertasService.showLoading("Buscando gastos...")
    this.gastosService.BuscarGastoPorFechas(this.filtro).subscribe(result => {
      console.log(result);
      if(result === null)
      this.alertasService.SetToast("No hay Gastos", 2);
      this.alertasService.hideLoading();
      this.alertasService.SetToast("Se encontraron " + result.Data.length + " gastos", 1)
      this.listaGastos = result.Data;
    })
  }

  ArmarFiltro() {
    this.filtro.FechaFin = this.FechaFin.toISOString();
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
  }

  EditarGasto(gasto: IGasto) {
    let ref = this.dialogService.open(CreacionGastoComponent, {
      header: 'Editar Gasto',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: true, gastoAEditar: gasto }
    });
    ref.onClose.subscribe((res) => {
      this.BuscarGasto();
    });
  };

  BorrarGasto(gasto: IGasto) {
    //alert("Se eliminara el gasto seleccionado");
    debugger;
    if (gasto.GAS_CODIGO == null || gasto.GAS_CODIGO + '' === '') {
      this.alertasService.SetToast('El Gasto no puede tener el codigo vacio', 3);
      return;
    }
    this.alertasService.confirmacion("Desea eliminar el Gasto con codigo: " + gasto.GAS_CODIGO).then(
      (resolve: any) => {
        if (resolve) {
          this.alertasService.showLoading('Eliminando el producto');
          this.gastosService.EliminarGasto(gasto.GAS_CODIGO).subscribe((result) => {
            if (result == null || result?.StatusCode.toString().indexOf('20') >= 0) {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Gasto Eliminado', 1);
              this.BuscarGasto();
            }
            else {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al eliminar el Gasto: ' + result?.message, 3);
              console.error(result);
            }
          });
        }
      })
  }

  CerrarGasto(gasto: IGasto) {
    this.alertasService.confirmacion("Desea Cerrar el gasto con codigo: " + gasto.GAS_CODIGO).then(
      (resolve: any) => {
        if (resolve) {
          this.alertasService.showLoading('Cerrando Gasto');
          this.gastosService.CerrarGasto(gasto.GAS_CODIGO).subscribe((result: any) => {
            if (result == null || result?.StatusCode.toString().indexOf('20') >= 0) {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Gasto Cerrado', 1);
              this.BuscarGasto();
            }
            else {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al cerrar el Gasto: ' + result?.message, 3);
              console.error(result);
            }
          })
        }
      });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { IGasto } from 'src/app/Interfaces/igasto';
import { CreacionGastoComponent } from 'src/app/Modales/creacion-gasto/creacion-gasto.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { GastosService } from 'src/app/Servicios/gastos.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IMotivoGasto } from 'src/app/Interfaces/imotivo-gasto';


@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent implements OnInit {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  listaGastos: IGasto[] = [];
  listaEstadisticaGastos: any[] = [];

  public searchKeyword: string = '';
  @ViewChild('dt2', { static: true }) table: any;
  customColumnHeaders: string[] = [];

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
    this.ConfigurarFechas();
    this.BuscarGastoPorFechas();
    // this.BuscarGasto();
  }
  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 30);
  }

  AbrirModalGastos() {
    let ref = this.dialogService.open(CreacionGastoComponent, {
      header: 'Nuevo Gasto',
      width: '60%',
      contentStyle: { overflow: 'auto', 'background-color': '#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: false }
    });
    ref.onClose.subscribe((res) => {
      this.FechaFin = new Date(Date.now());
      this.BuscarGastoPorFechas();
    });
  };

  BuscarBalanceDeGastos() {
    this.ArmarFiltro();
    this.alertasService.showLoading("Buscando gastos...")
    this.gastosService.BuscarEstadisticaGastosPorFechas(this.filtro).subscribe(result => {
      console.log(result);
      if (result === null)
        this.alertasService.SetToast("No hay Gastos", 2);
      this.alertasService.hideLoading();
      this.listaEstadisticaGastos = result.Data;
    })
  }

  BuscarGasto() {
    this.alertasService.showLoading("Cargando gastos");

    // Llamar al servicio para obtener todos los gastos
    this.gastosService.BuscarGastos().subscribe(
      (result: any) => {
        if (result && result.Data) {
          this.listaGastos = result.Data;
        } else {
          this.alertasService.SetToast("No hay gastos para mostrar.", 2);
        }
      },
      (error) => {
        console.error(error);
        this.alertasService.SetToast("Error al cargar los gastos.", 3);
      },
      () => {
        this.alertasService.hideLoading();
      }
    );
  }
  getSeverity(estado: boolean) {

    switch (estado) {
      case true:
        return 'success';
      case false:
        return 'warning';
    }


  }
  BuscarGastoPorFechas() {
    this.ArmarFiltro();
    this.alertasService.showLoading("Buscando gastos...")
    this.gastosService.BuscarGastoPorFechas(this.filtro).subscribe(result => {
      console.log(result);
      if (result === null)
        this.alertasService.SetToast("No hay Gastos", 2);
      this.alertasService.hideLoading();
      this.listaGastos = result.Data;
    })
    this.BuscarBalanceDeGastos();
  }
  ArmarFiltro() {
    this.filtro.FechaFin = this.FechaFin.toISOString();
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
  }

  EditarGasto(gasto: IGasto) {
    let ref = this.dialogService.open(CreacionGastoComponent, {
      header: 'Editar Gasto',
      width: '60%',
      contentStyle: { overflow: 'auto', 'background-color': '#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: true, gastoAEditar: gasto }
    });
    ref.onClose.subscribe((res) => {
      this.FechaFin = new Date(Date.now());
      this.BuscarGastoPorFechas();
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
          if (gasto.GAS_PENDIENTE == true) {
            this.gastosService.EliminarGasto(gasto.GAS_CODIGO).subscribe((result) => {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Gasto Eliminado', 1);
              this.BuscarGastoPorFechas();
            }, err => {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al eliminar el Gasto: ' + err?.message, 3);
              console.error(err);
            });
          } else {
            this.gastosService.AnularGasto(gasto.GAS_CODIGO).subscribe((result) => {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Gasto Eliminado', 1);
              this.BuscarGastoPorFechas();
            }, err => {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al eliminar el Gasto: ' + err?.message, 3);
              console.error(err);
            });
          }

        }
      })
  }
  exportExcel() {
    if (this.listaGastos.length === 0) {
      this.alertasService.SetToast('No hay datos para exportar.', 2);
      return;
    }
    import("xlsx").then((xlsx) => {
      const worksheet: XLSX.WorkSheet = xlsx.utils.json_to_sheet(this.listaGastos, { header: this.customColumnHeaders });

      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Reportes-gastos');
    });
  }



  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName);
  }


  CerrarGasto(gasto: IGasto) {
    this.alertasService.confirmacion("Desea Cerrar el gasto con codigo: " + gasto.GAS_CODIGO).then(
      (resolve: any) => {
        if (resolve) {
          this.alertasService.showLoading('Cerrando Gasto');
          this.gastosService.CerrarGasto(gasto.GAS_CODIGO).subscribe((result: any) => {

            this.alertasService.hideLoading();
            this.alertasService.SetToast('Gasto Cerrado', 1);
            this.BuscarGastoPorFechas();
          }, err => {
            this.alertasService.hideLoading();
            this.alertasService.SetToast('Error al cerrar el Gasto: ' + err?.message, 3);
            console.error(err);
          })
        }
      });
  }
}

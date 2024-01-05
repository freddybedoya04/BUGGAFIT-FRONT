import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CreacionCuentasComponent } from 'src/app/Modales/creacion-cuentas/creacion-cuentas.component';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { TipoCuentaService } from 'src/app/Servicios/tipocuenta.service';
import { ITipocuenta } from 'src/app/Interfaces/itipocuenta';
import { SelectItem } from 'primeng/api';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { TransaccionesService } from 'src/app/Servicios/transacciones.service';
import { ITransaccion } from 'src/app/Interfaces/itransaccion';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  public searchKeyword: string = '';
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  CuentaSeleccionada: ITipocuenta;
  listaTipoDeCuenta: ITipocuenta[] = [];
  listaTrasacciones: ITransaccion[] = [];
  listaTrasaccionesSeleccionadas: ITransaccion[] = [];
  customColumnHeaders: string[] = [];
  constructor(
    private dialogService: DialogService,
    private alertas: AlertasService,
    private transaccionesService: TransaccionesService,

    private tipoCuentaService: TipoCuentaService
  ) {
    this.rowsPerPage = alertas.ObtenerNumeroDeLineasTablas();
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
    }
    this.CuentaSeleccionada = {
      TIC_CODIGO: -1,
      TIC_NOMBRE: "",
      TIC_NUMEROREFERENCIA: 0,
      TIC_DINEROTOTAL: 0,
      TIC_FECHACREACION: new Date(),
      TIC_ESTADO: false,
    };
  }

  ngOnInit() {
    this.ConfigurarFechas();
    this.ObtenerTipoCuentas();
    this.BuscarTransferencias();
  }
  ObtenerTipoCuentas() {
    this.tipoCuentaService.ObtenerCuentas().subscribe((result: ITipocuenta[]) => {
      this.listaTipoDeCuenta = result.filter(x => x.TIC_NOMBRE != "CREDITO");
    });
  }
  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 30);
  }
  BuscarTransferencias() {
    if (this.CuentaSeleccionada == null || this.CuentaSeleccionada.TIC_CODIGO == -1) {
      this.BuscarTransaccionesPorFechas();

    } else {
      this.BuscarTransaccionesPorFechasYCuenta();
    }
    this.ObtenerTipoCuentas();
  }
  BuscarTransaccionesPorFechas() {
    this.ArmarFiltro();
    this.alertas.showLoading("Buscando transacciones...")
    this.transaccionesService.ObtenerTraansaccionesPorFecha(this.filtro).subscribe(result => {
      this.alertas.hideLoading();
      this.listaTrasacciones = result;
    }, err => {
      this.alertas.hideLoading();
      this.alertas.SetToast(err, 3);
    })
  }
  exportExcel() {

    if (this.listaTrasacciones.length === 0) {
      this.alertas.SetToast('No hay datos para exportar.', 2);
      return;
    }

    import("xlsx").then((xlsx) => {
      const worksheet: XLSX.WorkSheet = xlsx.utils.json_to_sheet(this.listaTrasacciones, { header: this.customColumnHeaders });

      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Transacciones');
    });
  }



  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName);
  }
  BuscarTransaccionesPorFechasYCuenta() {
    this.ArmarFiltro();
    this.alertas.showLoading("Buscando transacciones...")
    this.transaccionesService.ObtenerTraansaccionesPorFechayCuenta(this.filtro, this.CuentaSeleccionada.TIC_CODIGO).subscribe(result => {
      this.alertas.hideLoading();
      this.listaTrasacciones = result;
    }, err => {
      this.alertas.hideLoading();
      this.alertas.SetToast(err, 3);
    })
  }
  ArmarFiltro() {
    this.filtro.FechaFin = this.FechaFin.toISOString();
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
  }
  ConfirmarTransaccion(Transaccion: ITransaccion) {
    
    this.alertas.confirmacion("Esta seguro de Confirmar la Transaccion  # " + Transaccion.TRA_CODIGO + "?").then(result => {
      if (result) {
        this.alertas.showLoading("Confirmando Transaccion")

        this.transaccionesService.ConfirmarTransaccion(Transaccion.TRA_CODIGO).subscribe(x => {
          this.alertas.hideLoading();
          this.alertas.SetToast("Se Actualizo corretamente", 1)
          this.BuscarTransferencias();
        }, err => {
          this.alertas.hideLoading();
          this.alertas.SetToast(err, 3)
        })
      }
    })
  }
  ConfirmarTransacciones(Transaccion: ITransaccion[]) {
    const transacciones = Transaccion.map((transaccion: any) => {
      return transaccion.TRA_CODIGO;
    })
    this.alertas.confirmacion("Esta seguro de Confirmar las " + Transaccion.length + " Transacciones?").then(result => {
      if (result) {
        this.alertas.showLoading("Confirmando Transaccion")
        this.transaccionesService.ConfirmarVariasTransacciones(transacciones).subscribe(x => {
          this.alertas.hideLoading();
          this.alertas.SetToast("Se Actualizo corretamente", 1)
          this.BuscarTransferencias();
        }, err => {
          this.alertas.hideLoading();
          this.alertas.SetToast(err, 3)
        })
      }
    })
  }

  AbrirModalCuenta() {
    let ref = this.dialogService.open(CreacionCuentasComponent, {
      header: '',
      width: '40%',
      contentStyle: { overflow: 'auto', 'background-color': '#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: false }
    });
    ref.onClose.subscribe((res) => {
      this.FechaFin = new Date(Date.now());
      this.BuscarTransferencias();
    });
  };
  getSeverity(estado: any) {

    switch (estado) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return "";
    }

  }
  rowsPerPage: number = 50;
  CambioDeNumeroDePagina(event: any) {
    this.alertas.GuardarNumeroDeLineasTabla(event.rows)
  }
}


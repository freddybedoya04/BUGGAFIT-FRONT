import { Component, OnInit,ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Iabonos } from 'src/app/Interfaces/iabonos';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { Iventa } from 'src/app/Interfaces/iventa';
import { AbonosComponent } from 'src/app/Modales/abonos/abonos.component';
import { DetalleVentasComponent } from 'src/app/Modales/detalle-ventas/detalle-ventas.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { VentasService } from 'src/app/Servicios/ventas.service';
import * as FileSaver from 'file-saver'; 
import * as XLSX from 'xlsx'; 
import { IDetalleVentas } from 'src/app/Interfaces/idetalle-ventas';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  FechaInicio: Date;
  tablaSeleccionada: string = 'ventas';
  FechaFin: Date;
  items: MenuItem[] = [];
  activeItem: MenuItem = {};
  ventas: Iventa[] = [];
  filtro: IFiltro;
  data: any[] = []; 
  mostrarVentas: boolean = true;
  mostrarDetalles: boolean = false;

  detallesVentas:IDetalleVentas[]=[]
  @ViewChild('dt2', { static: true }) table: any;
  customColumnHeaders: string[] = [];
  public searchKeyword: string = '';
  constructor(private alertas:AlertasService,private ventasService:VentasService,private dialogService:DialogService) {
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
    }
  }
  ngOnInit() {
    this.items = [
      { label: 'Ventas' },
      { label: 'Cartera' },
      {label:'Detalles Venta'}
    ];
    this.activeItem = this.items[0];
    this.ConfigurarFechas();
    this.BuscarVentasPorFechas();
    this.BuscarDetallesPorFecha();
    // this.LlenadoVentas();
  }
    tablas: any[] = [
    { label: 'Ventas', value: 'ventas' },
    { label: 'Detalles', value: 'detalles' }
  ];

  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 30);
  }
  cambiarFuenteDatos(cambio:any) {
    this.mostrarVentas = cambio.value === 'ventas';
    this.mostrarDetalles = cambio.value === 'detalles';
  }

  getSeverity(estado: boolean) {

      switch (estado) {
        case true:
          return 'success';
        case false:
          return 'warning';
      }
    

  }

  BuscarVentasPorFechas() {
    this.ArmarFiltro();
    this.alertas.showLoading("Buscando ventas...")
    this.ventasService.BuscarVentasPorFechas(this.filtro).subscribe(result => {
      this.alertas.hideLoading();
      // this.alertas.SetToast("Se encontraron " + result.length + " ventas", 1)
      this.ventas = result;
    }, err => {
      this.alertas.hideLoading();
      this.alertas.SetToast(err, 3);
    })
  }
  ArmarFiltro() {
    this.filtro.FechaFin = this.FechaFin.toISOString();
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
  }
  EliminarVenta(venta:Iventa){
    debugger
    this.alertas.confirmacion("Esta seguro de eliminar la venta # "+venta.VEN_CODIGO+"?").then(result=>{
      if(result){
        this.alertas.showLoading("Eliminano venta")
        this.ventasService.EliminarVenta(venta.VEN_CODIGO).subscribe(x=>{
          this.alertas.hideLoading();
          this.alertas.SetToast("Se elimino corretamente",1)
          this.BuscarVentasPorFechas();
        },err=>{
          this.alertas.hideLoading();
          this.alertas.SetToast(err,3)
        })
      }
    })
  }
  ActualizarEstadoVenta(venta:Iventa){
    debugger
    this.alertas.confirmacion("Esta seguro de confirmar la venta # "+venta.VEN_CODIGO+"?").then(result=>{
      if(result){
        this.alertas.showLoading("Confirmando venta")
        this.ventasService.ActualizarEstadoVenta(venta.VEN_CODIGO).subscribe(x=>{
          this.alertas.hideLoading();
          this.alertas.SetToast("Se confirmo corretamente",1)
          this.BuscarVentasPorFechas();
        },err=>{
          this.alertas.hideLoading();
          this.alertas.SetToast(err,3)
        })
      }
    })
  }
  exportExcel() {

    if (this.ventas.length === 0) {
      this.alertas.SetToast('No hay datos para exportar.', 2);
      return;
    }
  
    import("xlsx").then((xlsx) => {
      const worksheet: XLSX.WorkSheet = xlsx.utils.json_to_sheet(this.ventas, { header: this.customColumnHeaders });
      
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Reportes');
    });
  }
  
  
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName);
  }
  BuscarDetalles(venta:Iventa){
    let nuevaVenta:Iventa=venta;
    this.alertas.showLoading("Cargando información de venta");
    this.ventasService.ListarDetallePorCodigoVenta(venta.VEN_CODIGO).subscribe(x=>{
      this.alertas.hideLoading();
      nuevaVenta.DetalleVentas=x;
      this.AbrirModaDetalleVentas(nuevaVenta);
    },err=>{
      this.alertas.hideLoading();
      this.alertas.SetToast('Error al traer detalles  de la venta',3)
    })
  }
  AbrirModaDetalleVentas(venta:Iventa) {
    let ref = this.dialogService.open(DetalleVentasComponent, {
      header: 'Venta #'+venta.VEN_CODIGO,
      width: '60%',
      baseZIndex: 100,
      maximizable: true,
      contentStyle:{'background-color':'#eff3f8'},
      data:{Venta:venta,}
    })
    ref.onClose.subscribe((res) => {
    });
  }

  BuscarAbonos(venta:Iventa){
    this.alertas.showLoading("Cargando información de abonos");
    this.ventasService.ListarAbonosPorCodigoVenta(venta.VEN_CODIGO).subscribe((abonos:Iabonos[])=>{
      this.alertas.hideLoading();
      this.AbrirModaAbonos(venta,abonos);
    },err=>{
      this.alertas.hideLoading();
      this.alertas.SetToast('Error al traer los abonos  de la venta',3)
    })
  }
// En tu componente (ReportesComponent)

BuscarDetallesPorFecha() {
  this.ArmarFiltro();
  this.alertas.showLoading("Buscando detalles por fecha");

  this.ventasService.BuscarDetallesPorFecha(this.filtro).subscribe(
    (detalles: IDetalleVentas[]) => {
      this.alertas.hideLoading();

      if (!detalles || detalles.length === 0) {
        this.alertas.SetToast("No hay detalles de ventas", 2);
      } else {
        this.detallesVentas = detalles;
      }
    },
    (error) => {
      console.error('Error al buscar detalles de la venta por fecha:', error);
      this.alertas.hideLoading();
      this.alertas.SetToast('Error al traer detalles de la venta por fecha', 3);
    }
  );
}



  AbrirModaAbonos(venta:Iventa,abonos:Iabonos[]) {
    let ref = this.dialogService.open(AbonosComponent, {
      header: 'Venta #'+venta.VEN_CODIGO,
      width: '60%',
      baseZIndex: 100,
      maximizable: true,
      contentStyle:{'background-color':'#eff3f8'},
      data:{Venta:venta,Abonos:abonos}
    })
    ref.onClose.subscribe((res) => {
      if(res==true){
        this.BuscarVentasPorFechas();
      }
    });
  }
}

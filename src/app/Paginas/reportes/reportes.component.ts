import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Iabonos } from 'src/app/Interfaces/iabonos';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { Iventa } from 'src/app/Interfaces/iventa';
import { AbonosComponent } from 'src/app/Modales/abonos/abonos.component';
import { DetalleVentasComponent } from 'src/app/Modales/detalle-ventas/detalle-ventas.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  FechaInicio: Date;
  FechaFin: Date;
  items: MenuItem[] = [];
  activeItem: MenuItem = {};
  ventas: Iventa[] = [];
  filtro: IFiltro;
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
      { label: 'Cartera' }
    ];
    this.activeItem = this.items[0];
    this.ConfigurarFechas();
    // this.LlenadoVentas();
  }

  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
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

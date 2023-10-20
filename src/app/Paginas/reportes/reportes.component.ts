import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { Iventa } from 'src/app/Interfaces/iventa';
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
  constructor(private alertas:AlertasService,private ventasService:VentasService) {
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
      this.alertas.SetToast("Se encontraron " + result.length + " ventas", 1)
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
          this.alertas.SetToast("Se elimino Corretamente",1)
          this.BuscarVentasPorFechas();
        },err=>{
          this.alertas.hideLoading();
          this.alertas.SetToast(err,3)
        })
      }
    })
  }

}

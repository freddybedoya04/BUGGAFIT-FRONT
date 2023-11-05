import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/Servicios/daschboard.service';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  backgroundColors: string[] = [];
  borderColors: string[] = [];
  Tabla: { Nombre: string, IngresosTotales: any,ComprasTotales: any,GastosTotales: any,Saldo:number }[] = [];
  Indicadores: {
    Ventas: number;
    Gastos: number;
    Compras: number;
    Utilidades: number;
    Deudas: number;
    Creditos: number;
    UltimasVentas: any[]; 
    ingresosCuentas:any[];
    GastosCuentas:any[];
    ComprasCuentas:any[];
    AbonosCuentas:any[];
    ProductosMasVendidos:any[];
  } = {
    Ventas: 0,
    Gastos: 0,
    Compras: 0,
    Utilidades: 0,
    Deudas: 0,
    Creditos: 0,
    UltimasVentas: [], 
    ingresosCuentas:[],
    GastosCuentas:[],
    ComprasCuentas:[],
    AbonosCuentas:[],
    ProductosMasVendidos:[]
  };

  constructor(private dashboardService: DashboardService,
    private aletasService:AlertasService) {
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: '',
      FechaInicio: '',
    };
  }

  ngOnInit() {
    this.ConfigurarFechas();
    this.calcularIndicadores();
  }

  ConfigurarFechas() {
    debugger;
    let Fecha=new Date();
    this.FechaInicio = new Date(Fecha.getFullYear(),Fecha.getMonth(),1,6,0,0);
    const ultimoDiaNoviembre = new Date(Fecha.getFullYear(),Fecha.getMonth(), 0).getDate();
    this.FechaFin = new Date(Fecha.getFullYear(),Fecha.getMonth(),ultimoDiaNoviembre,6,0,0);
  }

  calcularIndicadores() {
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
    this.filtro.FechaFin = this.FechaFin.toISOString();
    this.aletasService.showLoading('Cargando estadísticas')
    this.dashboardService.buscarDashboard(this.filtro.FechaInicio, this.filtro.FechaFin).subscribe((data: any) => {
      this.aletasService.hideLoading();
      this.Indicadores.Ventas = data.Data.DatosCards.SumaVentas;
      this.Indicadores.Gastos = data.Data.DatosCards.SumaGastos;
      this.Indicadores.Compras = data.Data.DatosCards.SumaCompras;
      this.Indicadores.Utilidades = this.Indicadores.Ventas - this.Indicadores.Gastos - this.Indicadores.Compras;
      this.Indicadores.Deudas = data.Data.DatosCards.SumaDeudas;
      this.Indicadores.Creditos = data.Data.DatosCards.SumaCreditos;
      this.Indicadores.UltimasVentas = data.Data.DatosGraficas.VentasRealizadas; 
      this.Indicadores.ingresosCuentas=data.Data.DatosGraficas.IngresosCuentas;
      this.Indicadores.GastosCuentas=data.Data.DatosGraficas.GastosCuentas;
      this.Indicadores.ComprasCuentas=data.Data.DatosGraficas.ComprasCuentas;
      this.Indicadores.AbonosCuentas=data.Data.DatosGraficas.AbonosCuentas;
      this.Indicadores.ProductosMasVendidos=data.Data.DatosGraficas.ProductosMasVendidos;
      this.Generartabla();
    },err=>{
      this.aletasService.hideLoading();
      this.aletasService.SetToast('Error al traer informacion de estadisticas',3)
    });
  }
  Generartabla(){
      debugger;
     var cuentas=this.Indicadores.ingresosCuentas.map((item)=>({Cuenta:item.Nombre}))
     this.Tabla=[];
     cuentas.forEach(element => {
        let obj={
          Nombre:element.Cuenta,
          IngresosTotales:this.Indicadores.ingresosCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.Cuenta)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0) +
          this.Indicadores.AbonosCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.Cuenta)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0) ,
          ComprasTotales:this.Indicadores.ComprasCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.Cuenta)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0),
          GastosTotales:this.Indicadores.GastosCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.Cuenta)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0),
          Saldo:0
        };
        obj.Saldo=obj.IngresosTotales - obj.ComprasTotales -obj.GastosTotales;
        this.Tabla.push(obj)
     });
  }

}

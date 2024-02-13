import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/Servicios/daschboard.service';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { Chart, registerables } from 'chart.js';
import { TipoCuentaService } from 'src/app/Servicios/tipocuenta.service';
import { ITipocuenta } from 'src/app/Interfaces/itipocuenta';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  @ViewChild('dt2', { static: true }) table: any;
  public searchKeyword: string = '';
  backgroundColors: string[] = [];
  borderColors: string[] = [];
  listaCuenta: ITipocuenta[] = [];
  Tabla: { Nombre: string, IngresosTotales: any, ComprasTotales: any, GastosTotales: any, Saldo: number }[] = [];
  Indicadores: {
    Ventas: number;
    Gastos: number;
    Compras: number;
    Utilidades: number;
    Inventario: number;
    UtilidadesNeta: number;
    Deudas: number;
    Creditos: number;
    UltimasVentas: any[];
    ingresosCuentas: any[];
    GastosCuentas: any[];
    ComprasCuentas: any[];
    AbonosCuentas: any[];
    ProductosVendidos: any[];
  } = {
      Ventas: 0,
      Gastos: 0,
      Compras: 0,
      Utilidades: 0,
      Inventario: 0,
      UtilidadesNeta: 0,
      Deudas: 0,
      Creditos: 0,
      UltimasVentas: [],
      ingresosCuentas: [],
      GastosCuentas: [],
      ComprasCuentas: [],
      AbonosCuentas: [],
      ProductosVendidos: []
    };

  constructor(private dashboardService: DashboardService,
    private aletasService: AlertasService,
    private tipoCuentaService: TipoCuentaService,
  ) {
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: '',
      FechaInicio: '',
    };
  }

  ngOnInit() {
    this.CargarCuentas();
    this.ConfigurarFechas();
    this.calcularIndicadores();
  }

  CargarCuentas() {
    this.tipoCuentaService.ObtenerCuentas().subscribe((result: ITipocuenta[]) => {
      if (result) {
        this.listaCuenta = result.filter(x=>x.TIC_NOMBRE.toLocaleUpperCase()!="CREDITO");
      }
    });
  }
  ConfigurarFechas() {
    ;
    let Fecha = new Date();
    this.FechaInicio = new Date(Fecha.getFullYear(), Fecha.getMonth(), 1, 6, 0, 0);
    const ultimoDiaNoviembre = new Date(Fecha.getFullYear(), Fecha.getMonth(), 0).getDate();
    this.FechaFin = new Date(Fecha.getFullYear(), Fecha.getMonth(), ultimoDiaNoviembre, 6, 0, 0);
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
      this.Indicadores.Utilidades = data.Data.DatosCards.Utilidades;
      this.Indicadores.Inventario = data.Data.DatosCards.Inventario;
      this.Indicadores.UtilidadesNeta = data.Data.DatosCards.UtilidadesBrutas;
      this.Indicadores.Deudas = data.Data.DatosCards.SumaDeudas;
      this.Indicadores.Creditos = data.Data.DatosCards.SumaCreditos;
      this.Indicadores.UltimasVentas = data.Data.DatosGraficas.VentasRealizadas;
      this.Indicadores.ingresosCuentas = data.Data.DatosGraficas.IngresosCuentas;
      this.Indicadores.GastosCuentas = data.Data.DatosGraficas.GastosCuentas;
      this.Indicadores.ComprasCuentas = data.Data.DatosGraficas.ComprasCuentas;
      this.Indicadores.AbonosCuentas = data.Data.DatosGraficas.AbonosCuentas;
      this.Indicadores.ProductosVendidos = data.Data.DatosGraficas.ProductosVendidos;
      console.log(this.Indicadores.ProductosVendidos)
      this.Generartabla();
    }, err => {
      this.aletasService.hideLoading();
      this.aletasService.SetToast('Error al traer informacion de estadisticas', 3)
    });
  }
  Generartabla() {
    ;
    this.Tabla = [];
    this.listaCuenta.forEach(element => {
      let obj = {
        Nombre: element.TIC_NOMBRE,
        IngresosTotales: this.Indicadores.ingresosCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.TIC_NOMBRE)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0) +
          this.Indicadores.AbonosCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.TIC_NOMBRE)
            .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0),
        ComprasTotales: this.Indicadores.ComprasCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.TIC_NOMBRE)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0),
        GastosTotales: this.Indicadores.GastosCuentas.filter(cuenta => cuenta && cuenta.MovimientoTotal && cuenta.Nombre === element.TIC_NOMBRE)
          .reduce((total, cuenta) => total + cuenta.MovimientoTotal, 0),
        Saldo: 0
      };
      obj.Saldo = obj.IngresosTotales - obj.ComprasTotales - obj.GastosTotales;
      this.Tabla.push(obj)
    });
  //  this.Indicadores.Utilidades= this.Tabla.reduce((total:number,actual)=>total+actual.Saldo,0);
  }
  

}

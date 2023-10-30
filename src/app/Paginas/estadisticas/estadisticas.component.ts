import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/Servicios/daschboard.service';
import { IFiltro } from 'src/app/Interfaces/ifiltro';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  Indicadores: {
    Ventas: number;
    Gastos: number;
    Compras: number;
    Utilidades: number;
    Deudas: number;
    Creditos: number;
    UltimasVentas: any[]; 
  } = {
    Ventas: 0,
    Gastos: 0,
    Compras: 0,
    Utilidades: 0,
    Deudas: 0,
    Creditos: 0,
    UltimasVentas: [], 
  };

  constructor(private dashboardService: DashboardService) {
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
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin);
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
  }

  calcularIndicadores() {
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
    this.filtro.FechaFin = this.FechaFin.toISOString();

    this.dashboardService.buscarDashboard(this.filtro.FechaInicio, this.filtro.FechaFin).subscribe((data: any) => {
      this.Indicadores.Ventas = data.Data.DatosCards.SumaVentas;
      this.Indicadores.Gastos = data.Data.DatosCards.SumaGastos;
      this.Indicadores.Compras = data.Data.DatosCards.SumaCompras;
      this.Indicadores.Utilidades = this.Indicadores.Ventas - this.Indicadores.Gastos - this.Indicadores.Compras;
      this.Indicadores.Deudas = data.Data.DatosCards.SumaDeudas;
      this.Indicadores.Creditos = data.Data.DatosCards.SumaCreditos;
      this.Indicadores.UltimasVentas = data.Data.DatosGraficas.VentasRealizadas; 
    });
  }
}

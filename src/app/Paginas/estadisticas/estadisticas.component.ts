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
  @ViewChild('barChart')
  barChart!: ElementRef;
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  backgroundColors: string[] = [];
  borderColors: string[] = [];
  Indicadores: {
    Ventas: number;
    Gastos: number;
    Compras: number;
    Utilidades: number;
    Deudas: number;
    Creditos: number;
    UltimasVentas: any[]; 
    ingresosCuentas:any[];
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
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin);
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
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
      this.Indicadores.ProductosMasVendidos=data.Data.DatosGraficas.ProductosMasVendidos;
      this.generateBarChart();
    },err=>{
      this.aletasService.hideLoading();
      this.aletasService.SetToast('Error al traer informacion de estadisticas',3)
    });
  }

  generateBarChart(): void {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.backgroundColors = this.generateRandomColors(this.Indicadores.ingresosCuentas.length);
    this.borderColors = this.backgroundColors.map(color => this.shadeColor(color, -20));
    Chart.register(...registerables);

    new Chart(ctx??canvas, {
      type: 'bar',
      data: {
        labels: this.Indicadores.ingresosCuentas.map(cuenta => cuenta.Nombre),
        datasets: [{
          label: 'Ingresos Totales',
          data: this.Indicadores.ingresosCuentas.map(cuenta => cuenta.IngresosTotales),
          backgroundColor: this.backgroundColors,
          borderColor: this.borderColors,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  generateRandomColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
      colors.push(color);
    }
    return colors;
  }

  shadeColor(color: string, percent: number): string {
    const f = parseInt(color.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = f >> 8 & 0x00FF;
    const B = f & 0x0000FF;
    return `rgba(${(Math.round((t - R) * p) + R)}, ${(Math.round((t - G) * p) + G)}, ${(Math.round((t - B) * p) + B)}, 1)`;
  }
}

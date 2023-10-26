import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/Servicios/ventas.service';
import { GastosService } from 'src/app/Servicios/gastos.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {


  exampleData: any;
  tableData: any[];
  Indicadores: {
    Ventas: number;
    Deudas: number;
    Gastos: number;
    Compras: number;
    Utilidades: number;
    Creditos: number;
  } = {
    Ventas: 0,
    Deudas: 0,
    Gastos: 0,
    Compras: 0,
    Utilidades: 0,
    Creditos: 0,
  };

  constructor(private ventasService: VentasService,private gastoService:GastosService) {
    // Datos de ejemplo para el gráfico
    this.exampleData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        {
          label: 'Ingresos',
          data: [1000, 1200, 800, 1500, 1100],
        },
        {
          label: 'Egresos',
          data: [500, 700, 600, 900, 800],
        },
        {
          label: 'Utilidades',
          data: [500, 500, 200, 600, 300],
        },
      ],
    };
    this.tableData = [
      { name: 'Dato 1', value: Math.random() * 1000 },
      { name: 'Dato 2', value: Math.random() * 1000 },
      { name: 'Dato 3', value: Math.random() * 1000 },
      { name: 'Dato 4', value: Math.random() * 1000 },
      { name: 'Dato 5', value: Math.random() * 1000 },
    ];
  }

  ngOnInit(): void {
    this.calcularIndicadores();
  }

  calcularIndicadores() {
    this.ventasService.BuscarVentas().subscribe((ventas: any[]) => {
      // Calcular el total de ventas
      this.Indicadores.Ventas = ventas.reduce((total, venta) => total + venta.VEN_PRECIOTOTAL, 0);
    });
      this.gastoService.BuscarGastos().subscribe((gastos: any[]) => {
        // Calcular el total de gastos
        this.Indicadores.Gastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    });
  }
}

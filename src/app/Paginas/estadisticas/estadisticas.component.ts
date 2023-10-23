import { Component } from '@angular/core';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent {
  exampleData: any;
  tableData: any[];

  constructor() {
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
}


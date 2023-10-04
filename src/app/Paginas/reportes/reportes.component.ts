import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

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
  constructor() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
  }
  ngOnInit() {
    this.items = [
      { label: 'Ventas' },
      { label: 'Cartera' }
    ];
    this.activeItem = this.items[0];
    this.ConfigurarFechas();
  }

  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
  }
}

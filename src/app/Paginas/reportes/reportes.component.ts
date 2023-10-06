import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Iventa } from 'src/app/Interfaces/iventa';

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
    this.LlenadoVentas();
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

  LlenadoVentas() {
    // Objeto 1
    this.ventas = [ {
      VEN_CODIGO: 1,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: new Date(),
      TIC_NOMBRE: "Tarjeta",
      TIC_CODIGO: 123,
      CLI_ID: 456,
      CLI_NOMBRE: "Cliente 1",
      CLI_DIRECCION: "Calle Principal 123",
      CLI_TELEFONO: "555-123-4567",
      CLI_TIPOCLIENTE: "Detal",
      VEN_PRECIOTOTAL: "100.00",
      VEN_ESTADOCREDITO: false,
      VEN_ENVIO: true,
      VEN_DOMICILIO: true,
      VEN_OBSERVACIONES: "Entregar en la puerta principal",
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: "1234567890",
      VEN_ESTADOVENTA: true,
      VEN_ESTADO: true,
    },
    {
      VEN_CODIGO: 2,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: new Date(),
      TIC_NOMBRE: "Efectivo",
      TIC_CODIGO: 456,
      CLI_ID: 789,
      CLI_NOMBRE: "Cliente 2",
      CLI_DIRECCION: "Avenida Secundaria 789",
      CLI_TELEFONO: "555-987-6543",
      CLI_TIPOCLIENTE: "Mayorista",
      VEN_PRECIOTOTAL: "150.00",
      VEN_ESTADOCREDITO: true,
      VEN_ENVIO: false,
      VEN_DOMICILIO: true,
      VEN_OBSERVACIONES: "Entregar en la puerta trasera",
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: "9876543210",
      VEN_ESTADOVENTA: true,
      VEN_ESTADO: true,
    },
    {
      VEN_CODIGO: 3,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: new Date(),
      TIC_NOMBRE: "Transferencia bancaria",
      TIC_CODIGO: 789,
      CLI_ID: 1011,
      CLI_NOMBRE: "Cliente 3",
      CLI_DIRECCION: "Plaza Principal 1011",
      CLI_TELEFONO: "555-111-2222",
      CLI_TIPOCLIENTE: "Detal",
      VEN_PRECIOTOTAL: "220.50",
      VEN_ESTADOCREDITO: true,
      VEN_ENVIO: true,
      VEN_DOMICILIO: true,
      VEN_OBSERVACIONES: "Entregar en la plaza central",
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: "1112223334",
      VEN_ESTADOVENTA: false,
      VEN_ESTADO: false,
    },
    ]

  }
}

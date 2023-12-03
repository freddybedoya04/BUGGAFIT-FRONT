import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Iventa } from 'src/app/Interfaces/iventa';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.scss']
})
export class DetalleVentasComponent implements OnInit {
  venta:Iventa;
  Impresion:boolean=false;
  constructor(public config: DynamicDialogConfig,private ventasService:VentasService){
    this.venta= {
      VEN_CODIGO: 0,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: new Date(),
      VEN_TIPOPAGO: '',
      TIC_CODIGO: 0,
      TIC_NOMBRE: '',
      CLI_ID: 0,
      CLI_NOMBRE: '',
      CLI_DIRECCION: '',
      CLI_TELEFONO: 0,
      CLI_CORREO:'',
      CLI_TIPOCLIENTE: '',
      VEN_PRECIOTOTAL: 0,
      VEN_ESTADOCREDITO: false,
      VEN_ENVIO: false,
      VEN_DOMICILIO: false,
      VEN_OBSERVACIONES: '',
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: '',
      VEN_ESTADOVENTA: false,
      VEN_ESTADO: false,
      TIP_CODIGO:0,	
      TIP_NOMBRE:"",
      DetalleVentas: []
    };
  }
  ngOnInit(): void {
    debugger
   this.venta=this.config.data.Venta;
   this.Impresion=this.config.data.Impresion??false;
   let fecha = new Date(this.venta.VEN_FECHAVENTA);
   this.venta.VEN_FECHAVENTA = new Date()
   this.venta.VEN_FECHAVENTA.setDate(fecha.getDate());
  }

}

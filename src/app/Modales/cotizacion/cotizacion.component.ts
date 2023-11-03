import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Icliente } from 'src/app/Interfaces/icliente';
import { IDetalleVentas } from 'src/app/Interfaces/idetalle-ventas';
import { ITiposEnvios } from 'src/app/Interfaces/tipos-envios';
import { TiposEnviosService } from 'src/app/Servicios/tipos-envios.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit{
  listaProductos:IDetalleVentas[]=[];
  cliente:Icliente;
  tipoEnvio:ITiposEnvios;
  TotalComprado:number;
  Fecha:string;
  listaTipoDeEnvio:ITiposEnvios[]=[]
  constructor(private config:DynamicDialogConfig,private ref:DynamicDialogRef,
    private tipoEnviosService:TiposEnviosService){
    this.cliente={
      ClI_ID: '',
      CLI_NOMBRE: '',
      CLI_TIPOCLIENTE: '',
      CLI_UBICACION: '',
      CLI_DIRECCION: '',
      CLI_FECHACREACION: new Date(),
      CLI_ESTADO: false
    };
    this.tipoEnvio={
      TIP_CODIGO: 0,
      TIP_NOMBRE: '',
      TIP_VALOR: 0,
      TIP_TIMESPAN: new Date(),
      TIP_ESTADO: false
    };
    this.TotalComprado=0;
    this.Fecha=formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
  }
  ngOnInit(): void {
    debugger
    this.listaProductos=this.config.data.Productos;
    this.cliente=this.config.data.Cliente;
    this.ObtenerTipoDeGastoEnvio();
  }
  CalcularCotizacion(){
    this.AgreagarEnvioAProductos();
    this.TotalComprado = this.listaProductos.reduce((anterior, actual) => {
      return anterior + actual.VED_PRECIOVENTA_TOTAL;
    }, 0)
  }

  AgreagarEnvioAProductos(){
    if(this.listaProductos.filter(x=>x.PRO_NOMBRE?.toLocaleUpperCase()=='ENVIO').length == 0){
      let producto:IDetalleVentas={
        VED_CODIGO: 0,
        VEN_CODIGO: 0,
        PRO_CODIGO: null,
        PRO_NOMBRE:  'ENVIO',
        VED_UNIDADES: '1',
        VED_PRECIOVENTA_UND: this.tipoEnvio.TIP_VALOR,
        VED_VALORDESCUENTO_UND: 0,
        VED_PRECIOVENTA_TOTAL:  this.tipoEnvio.TIP_VALOR,
        VED_ACTUALIZACION: new Date(),
        VED_ESTADO: false
      }
      this.listaProductos.push(producto);
    }

  }

  ObtenerTipoDeGastoEnvio() {
    this.tipoEnviosService.ObtenerTipoEnvios().subscribe((result: any) => {
      this.listaTipoDeEnvio = result;
      const codigoBuscado = this.config.data.TipoEnvio; // Código que buscas

      const tipoEncontrado = this.listaTipoDeEnvio.find(x => x.TIP_CODIGO === codigoBuscado);
      if (tipoEncontrado) {
        this.tipoEnvio = tipoEncontrado;
        this.CalcularCotizacion();
      } 
    });
  }
}

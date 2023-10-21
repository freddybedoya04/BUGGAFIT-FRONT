import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Iabonos } from 'src/app/Interfaces/iabonos';
import { Iventa } from 'src/app/Interfaces/iventa';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.scss']
})
export class AbonosComponent implements OnInit {

  venta: Iventa;
  abonos:Iabonos[]=[];
  saldo:number=0;
  totalAbonado:number=0;
  listaTipoDeCuenta: SelectItem[]=[];
  constructor(private ventasService:VentasService,private alertasService:AlertasService,
    private config:DynamicDialogConfig){
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
        CLI_TELEFONO: '',
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
        DetalleVentas: []
      };
  }
  ngOnInit(): void {
    this.venta=this.config.data.Venta;
    this.abonos=this.config.data.Abonos;
    this.ObtenerTipoCuentas();
    this.CalcularSaldo();
  }
  ObtenerTipoCuentas() {
    this.ventasService.BuscarTipoCuentas().subscribe((result: any) => {
      if (result === null) {
        this.alertasService.SetToast("No hay Cuentas asignadas.", 3);
        return;
      }
      this.listaTipoDeCuenta = result.map((item: any) => {
        const selectItem: SelectItem = {
          label: item.TIC_NOMBRE,
          value: item.TIC_CODIGO
        }
        return selectItem;
      });
    });
  }
  CalcularSaldo(){
    this.CalcularTotalAbonado();
    this.saldo=this.totalAbonado - this.venta.VEN_PRECIOTOTAL;
    this.config.header='Saldo pendiente $'+this.saldo.toLocaleString('en-US');
  }
  CalcularTotalAbonado(){
    this.totalAbonado=this.abonos.reduce((total, elemento) => total + elemento.CAR_VALORABONADO, 0);
  }
}

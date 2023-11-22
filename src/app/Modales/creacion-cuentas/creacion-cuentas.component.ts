import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ITipocuenta } from 'src/app/Interfaces/itipocuenta';
import { ITransaccionCuentas } from 'src/app/Interfaces/itransaccion-cuentas';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { TipoCuentaService } from 'src/app/Servicios/tipocuenta.service';
import { TransaccionesService } from 'src/app/Servicios/transacciones.service';

@Component({
  selector: 'app-creacion-cuentas',
  templateUrl: './creacion-cuentas.component.html',
  styleUrls: ['./creacion-cuentas.component.scss']
})
export class CreacionCuentasComponent implements OnInit {

  listaTipoDeCuenta: ITipocuenta[] = [];
  valorTransferencia: number = 0;
  transaccionCuentas: ITransaccionCuentas;


  constructor(
    private dialogService: DialogService,
    private alertas: AlertasService,
    private transaccionesService: TransaccionesService,
    private tipoCuentaService: TipoCuentaService,
    private ref: DynamicDialogRef,
  ) {
    this.transaccionCuentas = {
      IdCuentaOrigen: -1,
      IdCuentaDestino: -1,
      ValorTranferencia: 0,
      CedulaConfirmador: "",
    }

  }
  ngOnInit() {
    this.ObtenerTipoCuentas();
  }
  ObtenerTipoCuentas() {
    this.tipoCuentaService.ObtenerCuentas().subscribe((result: ITipocuenta[]) => {
      this.listaTipoDeCuenta = result.filter(x => x.TIC_NOMBRE != "CREDITO");
    });
  }
  AgregarTansaccion() {
    if (this.transaccionCuentas.IdCuentaOrigen === -1) { this.alertas.SetToast("Seleccione una cuenta origen.", 3); return }
    if (this.transaccionCuentas.IdCuentaDestino === -1) { this.alertas.SetToast("Seleccione una cuenta destino.", 3); return }
    if (this.transaccionCuentas.IdCuentaOrigen === this.transaccionCuentas.IdCuentaDestino) { this.alertas.SetToast("Las cuentas no pueden ser iguales.", 3); return }
    if (this.transaccionCuentas.ValorTranferencia <= 0) { this.alertas.SetToast("El valor de la transferencia debe ser mayor que cero.", 3); return }

    this.alertas.confirmacion("Esta seguro de realizar la transaccion?").then(result => {
      if (result) {
        this.alertas.showLoading("Realizando Transaccion")
        this.transaccionesService.TransaccionEntreCuentas(this.transaccionCuentas).subscribe(x => {
          this.alertas.hideLoading();
          this.alertas.SetToast("Se realizo la transaccion corretamente.", 1)
          this.CerradoPantalla();
        }, err => {
          this.alertas.hideLoading();
          this.alertas.SetToast(err, 3)
        })
      }
    })
  }
  CerradoPantalla() {
    this.ref.close();
  }
}

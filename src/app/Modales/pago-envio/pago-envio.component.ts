import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertasService } from 'src/app/Servicios/alertas.service';

@Component({
  selector: 'app-pago-envio',
  templateUrl: './pago-envio.component.html',
  styleUrls: ['./pago-envio.component.scss']
})
export class PagoEnvioComponent implements OnInit {
  listaTipoDeCuenta: SelectItem[] = [];
  EnvioSeleccionado: SelectItem;
  constructor(public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private alertarService: AlertasService) {
    this.EnvioSeleccionado = {
      label: '',
      value: ''
    }
  }
  ngOnInit(): void {
    debugger
    this.listaTipoDeCuenta = this.config.data.Listado;
  }
  Finalizar() {
    debugger
    if (this.EnvioSeleccionado == null || this.EnvioSeleccionado.label == "") {
      this.alertarService.SetToast("Debe Seleccionar una cuenta", 2);
      return;
    }
    this.ref.close(this.EnvioSeleccionado)
  }
}

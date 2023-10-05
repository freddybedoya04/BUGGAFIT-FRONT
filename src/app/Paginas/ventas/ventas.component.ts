import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {
  formularioVenta: FormGroup;
  tipopagoSeleccionado: any;
  tipodecuentaSeleccionado: any;
  tipoclienteSeleccionado!: string;

  constructor(private fb: FormBuilder, private primengConfig: PrimeNGConfig) {
    this.formularioVenta = fb.group({
      VEN_FECHAVENTA: [null, Validators.required],
      VEN_TIPOPAGO: [null, Validators.required],
      VEN_CUENTADESTINO: [null, Validators.required],
      CLI_ID: [null, Validators.required],
      CLI_NOMBRE: [null, Validators.required],
      CLI_DIRECCION: [null, Validators.required],
      CLI_UBICACION: [null, Validators.required],
      CLI_TIPOCLIENTE: [null, Validators.required],
      PRO_CODIGO: [null, Validators.required],
      PRO_NOMBRE: [null, Validators.required],
    });
  }
}

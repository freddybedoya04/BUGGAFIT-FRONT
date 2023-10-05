import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-creacion-producto',
  templateUrl: './creacion-producto.component.html',
  styleUrls: ['./creacion-producto.component.scss']
})
export class CreacionProductoComponent  {
  formularioProducto: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioProducto = fb.group({
      PRO_NOMBRE:[null,Validators.required]

    })
}
}
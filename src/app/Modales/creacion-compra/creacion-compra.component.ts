import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-creacion-compra',
  templateUrl: './creacion-compra.component.html',
  styleUrls: ['./creacion-compra.component.scss']
})
export class CreacionCompraComponent implements OnInit{
  formularioCompra: FormGroup;
  productos: Array<{ id: number; nombre: string; }> = [];

  productoSeleccionado: any; // Campo para almacenar la selección

  constructor(private fb:FormBuilder){
    this.formularioCompra=fb.group({
      COM_FechaCompra: [null, Validators.required],
      COM_PROVEEDOR: [null, Validators.required],
      TIC_CODIGO: [null, Validators.required],
      COM_ENBODEGA: [false], // Puedes establecer un valor predeterminado
      COM_CREDITO: [false], // Puedes establecer un valor predeterminado
      COM_VALORCOMPRA: [null, [Validators.required, Validators.min(0)]]
    })
    

  }
  ngOnInit(): void {
    this.productos=[
      { id: 1, nombre: 'Producto 1' },
      { id: 2, nombre: 'Producto 2' },
      { id: 3, nombre: 'Producto 3' },
    ];
  }
  venta: any = {}; // Objeto para almacenar los datos de la venta


}

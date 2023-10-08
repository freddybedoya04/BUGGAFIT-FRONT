import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';

@Component({
  selector: 'app-creacion-producto',
  templateUrl: './creacion-producto.component.html',
  styleUrls: ['./creacion-producto.component.scss'],
})
export class CreacionProductoComponent {
  formularioProducto: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private inventarioService: InventarioService,
    public ref: DynamicDialogRef
  ) {
    this.formularioProducto = this.formBuilder.group({
      PRO_CODIGO:[null,Validators.required],
      PRO_NOMBRE: [null, Validators.required],
      PRO_UNIDADES_DISPONIBLES: [null, Validators.required],
      PRO_PRECIO_COMPRA: [null, Validators.required],
      PRO_PRECIO_MAYORISTA: [null, Validators.required],
      PRO_PRECIO_DETAL: [null, Validators.required],
      PRO_MARCA: [null, Validators.required],
      PRO_CATEGORIA: [null, Validators.required],
      PRO_CANTIDAD: [null, Validators.required], 
      UNIDADES_MINIMA_ALERTA: [null, Validators.required],
    });
  }

  CrearProducto() {
    try {
      const Producto: Iproducto = {
        PRO_CODIGO: '', // Cambiar por un valor adecuado si es necesario
        PRO_NOMBRE: this.formularioProducto.get('PRO_NOMBRE')?.value,
        PRO_MARCA: this.formularioProducto.get('PRO_MARCA')?.value,
        PRO_CATEGORIA: this.formularioProducto.get('PRO_CATEGORIA')?.value,
        PRO_PRECIO_COMPRA: this.formularioProducto.get('PRO_PRECIO_COMPRA')?.value,
        PRO_PRECIOVENTA_MAYORISTA: this.formularioProducto.get('PRO_PRECIOVENTA_MAYORISTA')?.value,
        PRO_PRECIOVENTA_DETAL: this.formularioProducto.get('PRO_PRECIOVENTA_DETAL')?.value,
        PRO_UNIDADES_DISPONIBLES: this.formularioProducto.get('PRO_UNIDADES_DISPONIBLES')?.value,
        PRO_ACTUALIZACION: new Date(), // Cambiar por un valor adecuado si es necesario
        PRO_FECHACREACION: new Date(),
        PRO_ESTADO: true, // Cambiar si es necesario
        COM_CANTIDAD: this.formularioProducto.get('PRO_CANTIDAD')?.value,
        PRO_UNIDADES_MINIMAS_ALERTA: this.formularioProducto.get('UNIDADES_MINIMA_ALERTA')?.value,
      };

      this.alerta.showLoading('Creando nuevo producto');
      this.inventarioService.CrearProducto(Producto).subscribe(
        (result) => {
          this.alerta.hideLoading();
          this.alerta.SetToast('Producto creado', 1);
          this.CerradoPantalla();
        },
        (err) => {
          this.alerta.hideLoading();
          this.alerta.SetToast('Error al crear el producto: ' + err.message, 3);
          console.error(err);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  CerradoPantalla() {
    this.LimpiarPantalla();
    this.ref.close();
  }

  LimpiarPantalla() {
    
  }
}

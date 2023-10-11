import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-creacion-producto',
  templateUrl: './creacion-producto.component.html',
  styleUrls: ['./creacion-producto.component.scss'],
})
export class CreacionProductoComponent implements OnInit {
  formularioProducto: FormGroup;
  listaCategorias: SelectItem[] = [];
  listaMarcas: SelectItem[] = [];
  categoriaSeleccionada: any;
  marcaSeleccionada: any;

  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private inventarioService: InventarioService,
    public ref: DynamicDialogRef
  ) {
    this.formularioProducto = this.formBuilder.group({
      PRO_CODIGO: [null, Validators.required],
      PRO_NOMBRE: [null, Validators.required],
      PRO_UNIDADES_DISPONIBLES: [null, Validators.required],
      PRO_PRECIO_COMPRA: [null, Validators.required],
      PRO_PRECIO_MAYORISTA: [null, Validators.required],
      PRO_PRECIO_DETAL: [null, Validators.required],
      UNIDADES_MINIMA_ALERTA: [null, [Validators.required, Validators.min(0)]],
      PRO_CATEGORIA: [null, Validators.required],
      PRO_MARCA: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.ObtenerCategorias();
    this.ObtenerMarcas();
  }

  CrearProducto() {
    try {
      for (const control in this.formularioProducto.controls) {
        if (this.formularioProducto.controls[control].invalid) {
          this.alerta.SetToast(`El campo ${control.split('_')[1]} está incompleto`, 2);
          return;
        }
      }

      const codigoProducto = this.formularioProducto.get('PRO_CODIGO')?.value;
      this.inventarioService.BuscarProductoID(codigoProducto).subscribe(
        (productoExistente) => {
          if (productoExistente) {
            this.alerta.SetToast('Ya existe un producto con este codigo.', 2);
          } else {
            // Continuar con la creación del producto
            const Producto: Iproducto = {
              PRO_CODIGO: codigoProducto,
              PRO_NOMBRE: this.formularioProducto.get('PRO_NOMBRE')?.value,
              PRO_MARCA: this.formularioProducto.get('PRO_MARCA')?.value + '',
              PRO_CATEGORIA: this.formularioProducto.get('PRO_CATEGORIA')?.value + '',
              PRO_PRECIO_COMPRA: this.formularioProducto.get('PRO_PRECIO_COMPRA')?.value,
              PRO_PRECIOVENTA_MAYORISTA: this.formularioProducto.get('PRO_PRECIO_MAYORISTA')?.value,
              PRO_PRECIOVENTA_DETAL: this.formularioProducto.get('PRO_PRECIO_DETAL')?.value,
              PRO_UNIDADES_DISPONIBLES: this.formularioProducto.get('PRO_UNIDADES_DISPONIBLES')?.value,
              PRO_ACTUALIZACION: new Date(),
              PRO_FECHACREACION: new Date(),
              PRO_ESTADO: true,
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
          }
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
    this.formularioProducto.reset();
  }

  ObtenerCategorias() {
    this.inventarioService.ObtenerCategorias().subscribe(
      (result: any) => {
        if (result) {
          this.listaCategorias = result.map((item: any) => {
            const selectItem: SelectItem = {
              label: item.CAT_NOMBRE,
              value: item.CAT_CODIGO,
            };
            return selectItem;
          });
        }
      }
    );
  }
  
  ObtenerMarcas() {
    this.inventarioService.ObtenerMarcas().subscribe(
      (result: any) => {
        if (result) {
          this.listaMarcas = result.map((item: any) => {
            const selectItem: SelectItem = {
              label: item.MAR_NOMBRE,
              value: item.MAR_CODIGO,
            };
            return selectItem;
          });
        }
      }
    );
  }
}

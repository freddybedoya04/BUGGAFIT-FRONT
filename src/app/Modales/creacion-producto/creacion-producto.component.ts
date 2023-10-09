import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { icategoria } from 'src/app/Interfaces/icategoria';
import { imarca } from 'src/app/Interfaces/imarca';
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
      PRO_CANTIDAD: [null, Validators.required],
      UNIDADES_MINIMA_ALERTA: [null, Validators.required],
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
      const Producto: Iproducto = {
        PRO_CODIGO: '',
        PRO_NOMBRE: this.formularioProducto.get('PRO_NOMBRE')?.value,
        PRO_MARCA: this.marcaSeleccionada, 
        PRO_CATEGORIA: this.categoriaSeleccionada,
        PRO_PRECIO_COMPRA: this.formularioProducto.get('PRO_PRECIO_COMPRA')?.value,
        PRO_PRECIOVENTA_MAYORISTA: this.formularioProducto.get('PRO_PRECIO_MAYORISTA')?.value,
        PRO_PRECIOVENTA_DETAL: this.formularioProducto.get('PRO_PRECIO_DETAL')?.value,
        PRO_UNIDADES_DISPONIBLES: this.formularioProducto.get('PRO_UNIDADES_DISPONIBLES')?.value,
        PRO_ACTUALIZACION: new Date(),
        PRO_FECHACREACION: new Date(),
        PRO_ESTADO: true,
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
    this.formularioProducto.reset();
  }

  ObtenerCategorias() {
    this.inventarioService.ObtenerCategorias().subscribe(
      (categorias: any) => {
        if (categorias.data) {
          this.listaCategorias = categorias.data.map((categoria: any) => ({
            label: categoria.CAT_NOMBRE,
            value: categoria.CAT_CODIGO
          }));
        }
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  ObtenerMarcas() {
    this.inventarioService.ObtenerMarcas().subscribe(
      (marcas: any) => {
        if (marcas.data) {
          this.listaMarcas = marcas.data.map((marca: any) => ({
            label: marca.MAR_NOMBRE,
            value: marca.MAR_CODIGO
          }));
        }
      },
      (error) => {
        console.error('Error al obtener las marcas:', error);
      }
    );
  }
}

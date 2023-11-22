import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { SelectItem } from 'primeng/api';
import { MarcasService } from 'src/app/Servicios/marcas.service';
import { CategoriasService } from 'src/app/Servicios/categorias.service';

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
  esEdicion: boolean = false;
  productoAEditar: Iproducto;

  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private inventarioService: InventarioService,
    private marcasService:MarcasService,
    private categoriasService:CategoriasService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
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
      PRO_REGALO:false
    });
    this.productoAEditar = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      PRO_MARCA: '',
      PRO_CATEGORIA: '',
      PRO_PRECIO_COMPRA: 0,
      PRO_PRECIOVENTA_DETAL: 0,
      PRO_PRECIOVENTA_MAYORISTA: 0,
      PRO_UNIDADES_DISPONIBLES: 0,
      PRO_UNIDADES_MINIMAS_ALERTA: 0,
      PRO_ACTUALIZACION: new Date(),
      PRO_FECHACREACION: new Date(),
      PRO_ESTADO: false,
      COM_CANTIDAD: 0,
      PRO_REGALO:false
    };
  }

  ngOnInit() {
    this.ObtenerCategorias();
    this.ObtenerMarcas();
    this.CargarDatosEnLosInputs();
  }

  SubmitFormulario() {
    if (this.esEdicion) {
      this.EditarProducto();
    }
    else {
      this.CrearProducto();
    }
  }

  EditarProducto() {
    for (const control in this.formularioProducto.controls) {
      if (this.formularioProducto.controls[control].invalid) {
        this.alerta.SetToast(`El campo ${control.split('_')[1]} está incompleto`, 2);
        return;
      }
    }
    const codigoProducto = this.formularioProducto.get('PRO_CODIGO')?.value;
    this.inventarioService.BuscarProductoID(codigoProducto).subscribe(
      (productoExistente) => {
        if (!productoExistente) {
          this.alerta.SetToast('No se encontro el producto que desea editar.', 2);
        } else {
          // Continuar con la creación del producto
          const _producto: Iproducto = {
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
            PRO_REGALO: this.formularioProducto.get('PRO_REGALO')?.value 
          };
          this.productoAEditar = _producto;

          this.alerta.showLoading('Creando nuevo producto');
          this.inventarioService.ActualizarProducto(this.productoAEditar.PRO_CODIGO, this.productoAEditar).subscribe(
            (result) => {
              console.log(result);
              if (result == null || result?.StatusCode.toString().indexOf('20') >= 0) {
                this.alerta.hideLoading();
                this.alerta.SetToast('Producto Actualizado', 1);
                this.CerradoPantalla();
              }
              else{
                this.alerta.hideLoading();
                this.alerta.SetToast('Error al actualizar el producto: ' + result?.Message, 3);
                console.error(result);
              }
            }
          );
        }
      }
    );
  }

  CrearProducto() {
    try {
      debugger
      for (const control in this.formularioProducto.controls) {
        if (this.formularioProducto.controls[control].invalid) {
          this.alerta.SetToast(`El campo ${control.split('_')[1]} está incompleto`, 2);
          return;
        }
      }
      const codigoProducto = this.formularioProducto.get('PRO_CODIGO')?.value;
      this.inventarioService.BuscarProductoID(codigoProducto).subscribe(
        (productoExistente) => {
          if (productoExistente.length>0) {
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
              PRO_REGALO: this.formularioProducto.get('PRO_REGALO')?.value 
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
    this.categoriasService.ObtenerCategorias().subscribe(
      (result: any) => {
        if (result) {
          this.listaCategorias = result.map((item: any) => {
            const selectItem: SelectItem = {
              label: item.CAT_NOMBRE,
              value: item.CAT_CODIGO,
            };
            return selectItem;
          });

          const codigoCategoria = this.listaCategorias.filter((tipocliente: any) => {
            return tipocliente.label == this.productoAEditar.PRO_CATEGORIA;
          })[0]?.value ?? '';
          this.formularioProducto.get('PRO_CATEGORIA')?.setValue(codigoCategoria);
        }
      }
    );
  }

  ObtenerMarcas() {
    this.marcasService.ObtenerMarcas().subscribe(
      (result: any) => {
        if (result) {
          this.listaMarcas = result.map((item: any) => {
            const selectItem: SelectItem = {
              label: item.MAR_NOMBRE,
              value: item.MAR_CODIGO,
            };
            return selectItem;
          });
          const codigoMarca = this.listaMarcas.filter((tipocliente: any) => {
            return tipocliente.label == this.productoAEditar.PRO_MARCA;
          })[0]?.value ?? '';
          this.formularioProducto.get('PRO_MARCA')?.setValue(codigoMarca);
        }
      }
    );
  }

  private CargarDatosEnLosInputs() {
    this.esEdicion = this.config.data.esEdicion;
    this.productoAEditar = this.config.data.productoAEditar;

    if (this.esEdicion) {
      this.formularioProducto.get('PRO_CODIGO')?.disable();
      this.formularioProducto.get('PRO_CODIGO')?.setValue(this.productoAEditar?.PRO_CODIGO)
      this.formularioProducto.get('PRO_NOMBRE')?.disable();
      this.formularioProducto.get('PRO_NOMBRE')?.setValue(this.productoAEditar?.PRO_NOMBRE)
      this.formularioProducto.get('PRO_PRECIO_COMPRA')?.setValue(this.productoAEditar.PRO_PRECIO_COMPRA);
      this.formularioProducto.get('PRO_PRECIO_MAYORISTA')?.setValue(this.productoAEditar.PRO_PRECIOVENTA_MAYORISTA);
      this.formularioProducto.get('PRO_REGALO')?.setValue(this.productoAEditar.PRO_REGALO);
      this.formularioProducto.get('PRO_PRECIO_DETAL')?.setValue(this.productoAEditar.PRO_PRECIOVENTA_DETAL);
      this.formularioProducto.get('PRO_UNIDADES_DISPONIBLES')?.setValue(this.productoAEditar.PRO_UNIDADES_DISPONIBLES);
      this.formularioProducto.get('UNIDADES_MINIMA_ALERTA')?.setValue(this.productoAEditar.PRO_UNIDADES_MINIMAS_ALERTA);
    }
  }
}

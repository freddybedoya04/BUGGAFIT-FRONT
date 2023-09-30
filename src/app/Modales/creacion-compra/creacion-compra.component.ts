import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { combineLatest } from 'rxjs';
import { Icompras } from 'src/app/Interfaces/icompra';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { IdetalleCompra } from 'src/app/Interfaces/iproducto-comprado';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { ComprasService } from 'src/app/Servicios/compras.service';

@Component({
  selector: 'app-creacion-compra',
  templateUrl: './creacion-compra.component.html',
  styleUrls: ['./creacion-compra.component.scss']
})
export class CreacionCompraComponent implements OnInit {
  formularioCompra: FormGroup;
  productos: Iproducto[] = [];
  productoSeleccionado: Iproducto;
  ProductoComprado: IdetalleCompra;
  ListaProductosComprados: IdetalleCompra[] = []
  TotalComprado: number;
  Bodega: boolean;
  Credito: boolean;
  FechaActual: Date;
  constructor(private fb: FormBuilder, private alerta: AlertasService, private comprasService: ComprasService, public ref: DynamicDialogRef) {
    this.FechaActual = new Date(Date.now());
    this.formularioCompra = fb.group({
      COM_FechaCompra: [this.FechaActual, Validators.required],
      COM_PROVEEDOR: [null, Validators.required],
      TIC_CODIGO: [null, Validators.required],
      COM_ENBODEGA: [false], // Puedes establecer un valor predeterminado
      COM_CREDITO: [false], // Puedes establecer un valor predeterminado
    })

    this.productoSeleccionado = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      PRO_MARCA: '',
      PRO_CATEGORIA: '',
      PRO_PRECIO_COMPRA: 0,
      PRO_PRECIOVENTA_DETAL: 0,
      PRO_PRECIOVENTA_MAYORISTA: 0,
      PRO_UNIDADES_DISPONIBLES: 0,
      PRO_UNIDADES_MINIMAS_ALERTA: 0,
      PRO_ACTUALIZACION: new Date('2023-09-26'),
      PRO_FECHACREACION: new Date('2023-01-15'),
      PRO_ESTADO: true,
      COM_CANTIDAD: 0
    };
    this.ProductoComprado = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      DEC_PRECIOCOMPRA_PRODUCTO: 1,
      DEC_UNIDADES: 1,
      DEC_PRECIOTOTAL: 0,
    }
    this.TotalComprado = 0;
    this.Bodega = false;
    this.Credito = false;
  }
  ngOnInit(): void {
    this.productos = [
      {
        PRO_CODIGO: 'CREA_RX',
        PRO_NOMBRE: 'Creatina',
        PRO_MARCA: '1',
        PRO_CATEGORIA: '3',
        PRO_PRECIO_COMPRA: 90000,
        PRO_PRECIOVENTA_DETAL: 20.0,
        PRO_PRECIOVENTA_MAYORISTA: 18.0,
        PRO_UNIDADES_DISPONIBLES: 100,
        PRO_UNIDADES_MINIMAS_ALERTA: 10,
        PRO_ACTUALIZACION: new Date('2023-09-26'),
        PRO_FECHACREACION: new Date('2023-01-15'),
        PRO_ESTADO: true,
        COM_CANTIDAD: 20
      },
      {
        PRO_CODIGO: '002',
        PRO_NOMBRE: 'Caloricos',
        PRO_MARCA: 'Marca 2',
        PRO_CATEGORIA: 'Categoría 2',
        PRO_PRECIO_COMPRA: 15.0,
        PRO_PRECIOVENTA_DETAL: 25.0,
        PRO_PRECIOVENTA_MAYORISTA: 22.0,
        PRO_UNIDADES_DISPONIBLES: 75,
        PRO_UNIDADES_MINIMAS_ALERTA: 8,
        PRO_ACTUALIZACION: new Date('2023-09-25'),
        PRO_FECHACREACION: new Date('2023-02-20'),
        PRO_ESTADO: true,
        COM_CANTIDAD: 20
      },
      {
        PRO_CODIGO: '003',
        PRO_NOMBRE: 'Proteina',
        PRO_MARCA: 'Marca 3',
        PRO_CATEGORIA: 'Categoría 3',
        PRO_PRECIO_COMPRA: 12.0,
        PRO_PRECIOVENTA_DETAL: 22.0,
        PRO_PRECIOVENTA_MAYORISTA: 20.0,
        PRO_UNIDADES_DISPONIBLES: 120,
        PRO_UNIDADES_MINIMAS_ALERTA: 15,
        PRO_ACTUALIZACION: new Date('2023-09-24'),
        PRO_FECHACREACION: new Date('2023-03-10'),
        PRO_ESTADO: true,
        COM_CANTIDAD: 20
      },
    ];
  }
  CambioProducto() {
    this.ProductoComprado = {
      PRO_CODIGO: this.productoSeleccionado.PRO_CODIGO,
      PRO_NOMBRE: this.productoSeleccionado.PRO_NOMBRE,
      DEC_PRECIOCOMPRA_PRODUCTO: this.productoSeleccionado.PRO_PRECIO_COMPRA,
      DEC_UNIDADES: 1,
      DEC_PRECIOTOTAL: this.productoSeleccionado.PRO_PRECIO_COMPRA,
    }
  }
  CalcularTotalProducto(Producto: IdetalleCompra) {
    debugger;
    const cantidad = Producto.DEC_UNIDADES ?? 0;
    this.ProductoComprado.DEC_PRECIOTOTAL = cantidad * Producto.DEC_PRECIOCOMPRA_PRODUCTO;

  }
  AgregarProducto() {
    if (this.productoSeleccionado.PRO_CODIGO == "") {
      this.alerta.SetToast("Debe Seleccionar un producto.", 2)
      return;
    }
    if (this.ListaProductosComprados.findIndex(x => x.PRO_CODIGO == this.productoSeleccionado.PRO_CODIGO) != -1) {
      this.alerta.SetToast("Ya agrego este producto.", 2)
      return;
    }
    this.ListaProductosComprados.push(this.ProductoComprado)
    this.alerta.SetToast("Se agrego producto a la lista de compra", 1);
    this.CalcularTotalComprado();
    this.LimpiarProducto();
  }
  EliminarProducto(Producto: IdetalleCompra) {
    debugger;
    let index = this.ListaProductosComprados.findIndex(x => x.PRO_CODIGO == Producto.PRO_CODIGO);
    this.ListaProductosComprados.splice(index, 1);
    this.alerta.SetToast("Se elimino producto de la lista de compra", 1);
    this.CalcularTotalComprado();
  }
  CalcularTotalComprado() {
    this.TotalComprado = this.ListaProductosComprados.reduce((anterior, actual) => {
      return anterior + actual.DEC_PRECIOTOTAL;
    }, 0)
  }
  ValidacionCompra() {
    if (this.formularioCompra.valid) {
      if (this.ListaProductosComprados.length == 0) {
        this.alerta.SetToast("Seleccione almenos un producto a comprar.", 2);
        return;
      }
      this.CrearCompra();
    } else {
      for (const control in this.formularioCompra.controls) {
        if (this.formularioCompra.controls[control].invalid) {
          this.alerta.SetToast(`El campo ${control.split('_')[1]} está incompleto`, 2);
          break;
        }
      }
      return;
    }
  }
  CrearCompra() {
    debugger;
    try {
      const NuevaCompra: Icompras = {
        COM_CODIGO: 0,
        COM_FECHACREACION: new Date(),
        COM_FECHACOMPRA: this.formularioCompra.get('COM_FechaCompra')?.value.toISOString(),
        COM_VALORCOMPRA: this.TotalComprado,
        COM_PROVEEDOR: this.formularioCompra.get('COM_PROVEEDOR')?.value,
        TIC_CODIGO: this.formularioCompra.get('TIC_CODIGO')?.value,
        COM_FECHAACTUALIZACION: new Date(),
        COM_ENBODEGA: this.Bodega,
        COM_ESTADO: true,
        COM_CREDITO: this.Credito,
        USU_CEDULA: '9999',
        DetalleCompras: this.ListaProductosComprados
      }
      this.alerta.showLoading("Creando nueva compra")
      this.comprasService.CrearCompra(NuevaCompra).subscribe(result => {
        this.alerta.hideLoading();
        this.alerta.SetToast('Compra creada', 1);
        this.CerradoPantalla();
      }, err => {
        this.alerta.hideLoading();
        this.alerta.SetToast(err, 3)
        console.log(err)
      });

    } catch (error) {
      console.error(error)
    }


  }

  CerradoPantalla() {
    this.LimpiarPantalla();
    this.ref.close();
  }
  LimpiarPantalla() {
    this.formularioCompra.reset();
    this.Bodega = false;
    this.Credito = false;
    this.FechaActual = new Date(Date.now());
    this.formularioCompra.controls["COM_FechaCompra"].setValue(this.FechaActual);
    this.ListaProductosComprados = [];
    this.LimpiarProducto();
  }
  LimpiarProducto() {
    this.ProductoComprado = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      DEC_PRECIOCOMPRA_PRODUCTO: 1,
      DEC_UNIDADES: 1,
      DEC_PRECIOTOTAL: 0,
    }
    this.productoSeleccionado = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      PRO_MARCA: '',
      PRO_CATEGORIA: '',
      PRO_PRECIO_COMPRA: 0,
      PRO_PRECIOVENTA_DETAL: 0,
      PRO_PRECIOVENTA_MAYORISTA: 0,
      PRO_UNIDADES_DISPONIBLES: 0,
      PRO_UNIDADES_MINIMAS_ALERTA: 0,
      PRO_ACTUALIZACION: new Date('2023-09-26'),
      PRO_FECHACREACION: new Date('2023-01-15'),
      PRO_ESTADO: true,
      COM_CANTIDAD: 0
    };
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { combineLatest } from 'rxjs';
import { Icompras } from 'src/app/Interfaces/icompra';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { IdetalleCompra } from 'src/app/Interfaces/iproducto-comprado';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { ComprasService } from 'src/app/Servicios/compras.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

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
  listaTipoDeCuenta: SelectItem[] = [];
  @Input() EsEdicion: boolean;
  @Input() Compra: Icompras;
  constructor(private fb: FormBuilder, private alerta: AlertasService,
    private comprasService: ComprasService, public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,private inventarioService:InventarioService,
    private ventasService:VentasService) {
    this.FechaActual = new Date(Date.now());
    this.formularioCompra = fb.group({
      COM_FechaCompra: [this.FechaActual, Validators.required],
      COM_PROVEEDOR: [null],
      TIC_CODIGO: [null, Validators.required],
      // COM_ENBODEGA: [false], // Puedes establecer un valor predeterminado
      // COM_CREDITO: [false], // Puedes establecer un valor predeterminado
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
      DEC_CODIGO: 0,
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      DEC_PRECIOCOMPRA_PRODUCTO: 1,
      DEC_UNIDADES: 1,
      DEC_PRECIOTOTAL: 0,
      DEC_ESTADO: true
    }
    this.Compra = {
      "COM_CODIGO": 0,
      "COM_FECHACREACION": new Date(),
      "COM_FECHACOMPRA": new Date(),
      "COM_VALORCOMPRA": 0,
      "COM_PROVEEDOR": "",
      "TIC_CODIGO": 0,
      "TIC_NOMBRE": "",
      "COM_FECHAACTUALIZACION": new Date(),
      "COM_ENBODEGA": false,
      "COM_ESTADO": false,
      "COM_CREDITO": false,
      "USU_CEDULA": "",
      "DetalleCompras": []
    }


    this.TotalComprado = 0;
    this.Bodega = false;
    this.Credito = false;
    this.EsEdicion = false;
  }
  ngOnInit(): void {
    this.LlenadoProductos();
    this.ObtenerTipoCuentas();
    debugger;
    this.EsEdicion = this.config.data.esEdicion;
    if (this.EsEdicion == true) {
      this.Compra = this.config.data.nuevacompra;
      this.LlenadoCompra();
    }


  }
  LlenadoProductos() {
    this.inventarioService.BuscarProductos().subscribe(x =>{
      this.productos=x;
    })
  }
  ObtenerTipoCuentas() {
    this.ventasService.BuscarTipoCuentas().subscribe((result: any) => {
      this.listaTipoDeCuenta = result.filter((x: { TIC_NOMBRE: string; })=>!x.TIC_NOMBRE.toLocaleUpperCase().includes("CREDITO")).map((item: any) => {
        const selectItem: SelectItem = {
          label: item.TIC_NOMBRE,
          value: item.TIC_CODIGO
        }
        return selectItem;
      });
    });
  }
  CambioProducto() {
    this.ProductoComprado = {
      DEC_CODIGO: 0,
      PRO_CODIGO: this.productoSeleccionado.PRO_CODIGO,
      PRO_NOMBRE: this.productoSeleccionado.PRO_NOMBRE,
      DEC_PRECIOCOMPRA_PRODUCTO: this.productoSeleccionado.PRO_PRECIO_COMPRA,
      DEC_UNIDADES: 1,
      DEC_PRECIOTOTAL: this.productoSeleccionado.PRO_PRECIO_COMPRA,
      DEC_ESTADO: true
    }
  }
  CalcularTotalProducto(Producto: IdetalleCompra) {
    debugger;
    const cantidad = Producto.DEC_UNIDADES ?? 0;
    this.ProductoComprado.DEC_PRECIOTOTAL = cantidad * Producto.DEC_PRECIOCOMPRA_PRODUCTO;

  }
  AgregarProducto() {
    if (this.productoSeleccionado==null || this.productoSeleccionado.PRO_CODIGO == "") {
      this.alerta.SetToast("Debe Seleccionar un producto.", 2)
      return;
    }
    if (this.ListaProductosComprados.findIndex(x => x.PRO_CODIGO == this.productoSeleccionado.PRO_CODIGO && x.DEC_ESTADO !=false) != -1 ) {
      this.alerta.SetToast("Ya agrego este producto.", 2)
      return;
    }
    this.ProductoComprado.PRO_CODIGO = this.productoSeleccionado.PRO_CODIGO;
    this.ProductoComprado.DEC_ESTADO = true;
    this.ListaProductosComprados.push(this.ProductoComprado)
    this.alerta.SetToast("Se agrego producto a la lista de compra", 1);
    this.CalcularTotalComprado();
    this.LimpiarProducto();
  }
  EliminarProducto(Producto: IdetalleCompra) {
    debugger;
    if (this.EsEdicion == false) {
      let index = this.ListaProductosComprados.findIndex(x => x.PRO_CODIGO == Producto.PRO_CODIGO);
      this.ListaProductosComprados.splice(index, 1);

    } else {
      Producto.DEC_ESTADO = false;
    }
    this.alerta.SetToast("Se elimino producto de la lista de compra", 1);
    this.CalcularTotalComprado();
  }
  CalcularTotalComprado() {
    this.TotalComprado = this.ListaProductosComprados.reduce((anterior, actual) => {

      return anterior + (actual.DEC_ESTADO == true ? actual.DEC_PRECIOTOTAL : 0);
    }, 0)
  }
  ValidacionCompra() {
    if (this.formularioCompra.valid) {
      if (this.ListaProductosComprados.length == 0) {
        this.alerta.SetToast("Seleccione almenos un producto a comprar.", 2);
        return;
      }
      if (this.EsEdicion == false) {
        this.CrearCompra();
      } else {
        this.ActualizarCompra();
      }

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
        COM_FECHACOMPRA:  new Date (this.formularioCompra.get('COM_FechaCompra')?.value),
        COM_VALORCOMPRA: this.TotalComprado,
        COM_PROVEEDOR: this.formularioCompra.get('COM_PROVEEDOR')?.value??'',
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

  LlenadoCompra() {
    this.formularioCompra.controls["COM_FechaCompra"].setValue(new Date(this.Compra.COM_FECHACOMPRA));
    this.formularioCompra.controls["COM_PROVEEDOR"].setValue(this.Compra.COM_PROVEEDOR);
    this.formularioCompra.controls["TIC_CODIGO"].setValue(this.Compra.TIC_CODIGO);
    this.Bodega = this.Compra.COM_ENBODEGA;
    this.Credito = this.Compra.COM_CREDITO;
    // this.formularioCompra.patchValue({
    //   COM_ENBODEGA: this.Compra.COM_ENBODEGA,
    //   COM_CREDITO: this.Compra.COM_CREDITO,
    // });

    this.TotalComprado = this.Compra.COM_VALORCOMPRA;
    this.ListaProductosComprados = this.Compra.DetalleCompras!;
  }

  ActualizarCompra() {
    debugger;
    try {
      const NuevaCompra: Icompras = {
        COM_CODIGO: this.Compra.COM_CODIGO,
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
      this.alerta.showLoading("Actualizando compra")
      this.comprasService.ActualizarCompra(NuevaCompra).subscribe(result => {
        this.alerta.hideLoading();
        this.alerta.SetToast('Compra Acualizada', 1);
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
      DEC_CODIGO: 0,
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
  getSeverity(estado: boolean) {
    switch (estado) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }
}

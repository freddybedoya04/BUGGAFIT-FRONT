import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { IproductoComprado } from 'src/app/Interfaces/iproducto-comprado';

@Component({
  selector: 'app-creacion-compra',
  templateUrl: './creacion-compra.component.html',
  styleUrls: ['./creacion-compra.component.scss']
})
export class CreacionCompraComponent implements OnInit {
  formularioCompra: FormGroup;
  productos: Iproducto[] = [];
  productoSeleccionado: Iproducto; 
  ProductoComprado:IproductoComprado;
  ListaProductosComprados:IproductoComprado[]=[]
  constructor(private fb: FormBuilder) {
    this.formularioCompra = fb.group({
      COM_FechaCompra: [null, Validators.required],
      COM_PROVEEDOR: [null, Validators.required],
      TIC_CODIGO: [null, Validators.required],
      COM_ENBODEGA: [false], // Puedes establecer un valor predeterminado
      COM_CREDITO: [false], // Puedes establecer un valor predeterminado
      COM_VALORCOMPRA: [null, [Validators.required, Validators.min(0)]]
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
    this.ProductoComprado={
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      PRO_PRECIO_COMPRA: 1,
      COM_CANTIDAD: 1,
      PRO_PRECIO_TOTAL: 0,
    }
  }
  ngOnInit(): void {
    this.productos = [
      {
        PRO_CODIGO: '001',
        PRO_NOMBRE: 'Creatina',
        PRO_MARCA: 'Marca 1',
        PRO_CATEGORIA: 'Categoría 1',
        PRO_PRECIO_COMPRA: 10.5,
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
  CambioProducto(){
    this.ProductoComprado={
      PRO_CODIGO: this.productoSeleccionado.PRO_CODIGO,
      PRO_NOMBRE: this.productoSeleccionado.PRO_NOMBRE,
      PRO_PRECIO_COMPRA: this.productoSeleccionado.PRO_PRECIO_COMPRA,
      COM_CANTIDAD: 1,
      PRO_PRECIO_TOTAL: this.productoSeleccionado.PRO_PRECIO_COMPRA,
    }
  }
  CalcularTotalProducto(Producto: any ) {
    debugger;
    const cantidad = Producto.COM_CANTIDAD ?? 0;
     this.ProductoComprado.PRO_PRECIO_TOTAL = cantidad * Producto.PRO_PRECIO_COMPRA;

  }
  AgregarProducto(){
    
    this.ListaProductosComprados.push(this.ProductoComprado)
  }



}

import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  url: string = "Inventario/";
  constructor(private http: HttpClientService) { }

  BuscarProductos() {
    return this.http.get(this.url + 'GetProductos').pipe(
      map((result: any) => {
        return result.Data
      }));
  }
  BuscarProductoID(producto: string) {
    return this.http.get(this.url + 'GetProducto/' + producto).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  CrearProducto(producto: Iproducto) {
    return this.http.post(this.url + 'PostProducto', producto).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  EliminarProducto(codigoProducto: string) {
    return this.http.delete(this.url + 'DeleteProducto/' + codigoProducto).pipe(
      map((result: any) => {
        return result;
      }));
  }
  ActualizarProducto(codProducto: string, producto: Iproducto) {
    return this.http.put(this.url + 'PutProducto/' + codProducto, producto).pipe(
      map((result: any) => {
        return result;
      }));
  }
  ObtenerMarcas() {
    return this.http.get(this.url + 'GetMarcas').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  ObtenerCategorias() {
    return this.http.get(this.url + 'GetCategorias').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
}

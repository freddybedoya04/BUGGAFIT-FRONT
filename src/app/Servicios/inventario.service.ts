import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { IApiResponse } from '../Interfaces/iapiresponse';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  url: string = "Inventario/";
  constructor(private http: HttpClientService) { }

  BuscarProductos() {
    return this.http.get<IApiResponse>(this.url + 'GetProductos').pipe(
      map((result: IApiResponse) => {
        return result.Data
      }));
  }
  BuscarProductoID(producto: string) {
    return this.http.get<IApiResponse>(this.url + 'GetProducto/' + producto).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  CrearProducto(producto: Iproducto) {
    return this.http.post<IApiResponse>(this.url + 'PostProducto', producto).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  EliminarProducto(codigoProducto: string) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteProducto/' + codigoProducto).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  ActualizarProducto(codProducto: string, producto: Iproducto) {
    return this.http.put<IApiResponse>(this.url + 'PutProducto/' + codProducto, producto).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  ObtenerMarcas() {
    return this.http.get<IApiResponse>(this.url + 'GetMarcas').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  ObtenerCategorias() {
    return this.http.get<IApiResponse>(this.url + 'GetCategorias').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Iventa } from '../Interfaces/iventa';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  url: string = "Ventas/";
  constructor(private http: HttpClientService) { }

  BuscarVentas() {
    return this.http.get(this.url + 'GetVentas').pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  BuscarVentaID(venta: number) {
    return this.http.get(this.url + 'GetVenta/' + venta).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  CrearVenta(venta: Iventa) {
    return this.http.post(this.url + 'PostVenta', venta).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  EliminarVenta(venta: number) {
    return this.http.delete(this.url + 'DeleteVenta/' + venta).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  ActualizarVenta(venta: number) {
    return this.http.put(this.url + 'PutVenta/' + venta, venta).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
}

import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Iventa } from '../Interfaces/iventa';
import { Observable, map } from 'rxjs';
import { IFiltro } from '../Interfaces/ifiltro';
import { Iabonos } from '../Interfaces/iabonos';
import { IApiResponse } from '../Interfaces/iapiresponse';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  url: string = "Ventas/";
  constructor(private http: HttpClientService) { }

  BuscarVentas() {
    return this.http.get<IApiResponse>(this.url + 'GetVentas').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  BuscarVentaID(venta: number) {
    return this.http.get<IApiResponse>(this.url + 'GetVenta/' + venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  BuscarVentasPorFechas(filtro:IFiltro){
    return this.http.post<IApiResponse>(this.url+'PostListadoVenta',filtro).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  CrearVenta(venta: Iventa) {
    return this.http.post<IApiResponse>(this.url + 'PostVenta', venta).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  EliminarVenta(venta: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteVentas/' + venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }

  ActualizarVenta(venta: number) {
    return this.http.put<IApiResponse>(this.url + 'PutVenta/' + venta, venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  AnularVenta(venta: number) {
    return this.http.put<IApiResponse>(this.url + 'AnularVenta/' + venta, venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ActualizarEstadoVenta(venta: number) {
    return this.http.get<IApiResponse>(this.url + 'ActualizarEstadoVenta/' + venta).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  BuscarTipoCuentas() {
    return this.http.get<IApiResponse>('TipoCuentas/GetTipoCuentas').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ListarDetallePorCodigoVenta(venta:number) {
    return this.http.get<IApiResponse>(this.url+'ListarDetallePorCodigoVenta/'+venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ListarAbonosPorCodigoVenta(venta:number) {
    return this.http.get<IApiResponse>(this.url+'ListarAbonosPorCodigoVenta/'+venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  CrearAbono(abono: Iabonos) {
    return this.http.post<IApiResponse>(this.url + 'CrearAbono', abono).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  EliminarAbono(Abono: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteAbono/' + Abono).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  AnularAbono(abono: number) {
    return this.http.put<IApiResponse>(this.url + 'AnularAbono/' + abono, abono).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ActualizarAbono(Abono:Iabonos) {
    return this.http.put<IApiResponse>(this.url + 'PutAbonos/', Abono).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  FinalizarCredito(venta:number) {
    return this.http.get<IApiResponse>(this.url + 'FinalizarCredito/'+venta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

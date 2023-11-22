import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { ITiposEnvios } from '../Interfaces/tipos-envios';
import { IApiResponse } from '../Interfaces/iapiresponse';
import { IFiltro } from '../Interfaces/ifiltro';
import { CuentasComponent } from '../Paginas/cuentas/cuentas.component';
import { ITransaccion } from '../Interfaces/itransaccion';
import { ITransaccionCuentas } from '../Interfaces/itransaccion-cuentas';
@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  url: string = "Transacciones/";
  constructor(private http: HttpClientService) { }

  ObtenerTraansaccionesPorFecha(filtro: IFiltro) {
    return this.http.post<IApiResponse>(this.url + 'TransaccionesPorFecha', filtro).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  ObtenerTraansaccionesPorFechayCuenta(filtro: IFiltro, tic_codigo: number) {
    return this.http.post<IApiResponse>(this.url + 'TransaccionesPorFechaYCuenta/' + tic_codigo, filtro).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  ConfirmarTransaccion(Tra_codigo: number) {
    const usuario = JSON.parse(localStorage.getItem('user') || "").USU_CEDULA;
    return this.http.put<IApiResponse>(this.url + 'ConfirmarTransaccion/' + Tra_codigo + '?usuario=' + usuario, Tra_codigo).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ConfirmarVariasTransacciones(transacciones: number[]) {
    const usuario = JSON.parse(localStorage.getItem('user') || "").USU_CEDULA;
    return this.http.post<IApiResponse>(this.url + 'ConfirmarTransacciones/?usuario=' + usuario, transacciones).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ConfirmarTransacciones(listaTransacciones: number[]) {
    return this.http.post<IApiResponse>(this.url + 'ConfirmarTransacciones', listaTransacciones).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  TransaccionEntreCuentas(transaccion: ITransaccionCuentas) {
    transaccion.CedulaConfirmador = JSON.parse(localStorage.getItem('user') || "").USU_CEDULA;
    return this.http.post<IApiResponse>(this.url + 'CrearTransaccionEntreCuentas', transaccion).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  CrearTransaccion(transaccion: ITransaccion) {
    return this.http.post<IApiResponse>(this.url + 'PostCrearTransaccion', transaccion).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

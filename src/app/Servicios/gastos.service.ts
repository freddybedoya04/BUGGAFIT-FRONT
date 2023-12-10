import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { map } from 'rxjs';
import { IGasto } from '../Interfaces/igasto';
import { IFiltro } from '../Interfaces/ifiltro';
import { IApiResponse } from '../Interfaces/iapiresponse';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  url: string = "Gastos/";
  constructor(private http: HttpClientService) { }

  BuscarMotivoGasto() {
    return this.http.get(this.url + 'GetGasto/MotivoEnvio').pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  CrearGastoVenta(gasto: IGasto) {
    return this.http.post<IApiResponse>(this.url + 'PostGastoVenta', gasto).pipe(
      map((result: IApiResponse) => {
        return result.StatusCode;
      }));
  }
  CrearGasto(gasto: IGasto) {
    return this.http.post<IApiResponse>(this.url + 'PostGasto', gasto).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  BuscarGastoPorFechas(filtro: IFiltro) {
    return this.http.post<IApiResponse>(this.url + 'ListarGastosPorFecha', filtro).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  BuscarEstadisticaGastosPorFechas(filtro: IFiltro) {
    return this.http.post<IApiResponse>(this.url + 'EstadisticaGastos', filtro).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  CerrarGasto(gasto: number) {
    return this.http.get<IApiResponse>(this.url + 'GetCerrarGasto/' + gasto).pipe(
      map((result: IApiResponse) => {
        return result.StatusCode;
      }));
  }
  BuscarGastos() {
    return this.http.get<IApiResponse>(this.url + 'GetGastos').pipe(
      map((result: IApiResponse) => {
        return result.Data
      }));
  }
  BuscarGastoID(gasto: string) {
    return this.http.get<IApiResponse>(this.url + 'GetGasto/' + gasto).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  EliminarGasto(codigoGasto: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteGasto/' + codigoGasto).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  AnularGasto(gasto: number) {
    return this.http.put<IApiResponse>(this.url + 'AnularGasto/' + gasto, gasto).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  ActualizarGasto(codGasto: string, gasto: IGasto) {
    return this.http.put<IApiResponse>(this.url + 'PutGasto/' + codGasto, gasto).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
}

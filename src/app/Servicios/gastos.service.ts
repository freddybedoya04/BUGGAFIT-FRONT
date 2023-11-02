import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { map } from 'rxjs';
import { IGasto } from '../Interfaces/igasto';
import { IFiltro } from '../Interfaces/ifiltro';

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
    return this.http.post(this.url + 'PostGastoVenta', gasto).pipe(
      map((result: any) => {
        return result.StatusCode;
      }));
  }
  CrearGasto(gasto: IGasto) {
    return this.http.post(this.url + 'PostGasto', gasto).pipe(
      map((result: any) => {
        return result;
      }));
  }
  BuscarGastoPorFechas(filtro: IFiltro) {
    return this.http.post(this.url + 'ListarGastosPorFecha', filtro).pipe(
      map((result: any) => {
        return result;
      }));
  }
  
  CerrarGasto(gasto: number) {
    return this.http.get(this.url + 'GetCerrarGasto/' + gasto).pipe(
      map((result: any) => {
        return result.StatusCode;
      }));
  }
  BuscarGastos() {
    return this.http.get(this.url + 'GetGastos').pipe(
      map((result: any) => {
        return result.Data
      }));
  }
  BuscarGastoID(gasto: string) {
    return this.http.get(this.url + 'GetGasto/' + gasto).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  EliminarGasto(codigoGasto: number) {
    return this.http.delete(this.url + 'DeleteGasto/' + codigoGasto).pipe(
      map((result: any) => {
        return result;
      }));
  }
  ActualizarGasto(codGasto: string, gasto: IGasto) {
    return this.http.put(this.url + 'PutGasto/' + codGasto, gasto).pipe(
      map((result: any) => {
        return result;
      }));
  }
}

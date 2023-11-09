import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { ITipocuenta } from '../Interfaces/itipocuenta';
import { IApiResponse } from '../Interfaces/iapiresponse';
@Injectable({
  providedIn: 'root'
})
export class TipoCuentaService {

  url: string = "TipoCuentas/";
  constructor(private http: HttpClientService) { }

  ObtenerCuentas() {
    return this.http.get<IApiResponse>(this.url + 'GetTipoCuentas').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  CrearCuenta(cuenta: ITipocuenta) {
    return this.http.post<IApiResponse>(this.url + 'PostTipoCuenta', cuenta).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  EliminaCuenta(cuenta: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteTipoCuenta/' + cuenta).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ActualizarCuenta(cuenta: ITipocuenta) {
    return this.http.post<IApiResponse>(this.url + 'PutTipoCuenta' +cuenta.TIC_CODIGO , cuenta).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }

}
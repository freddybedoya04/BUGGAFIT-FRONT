import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { ITipocuenta } from '../Interfaces/itipocuenta';
@Injectable({
  providedIn: 'root'
})
export class TipoCuentaService {

  url: string = "TipoCuentas/";
  constructor(private http: HttpClientService) { }

  ObtenerCuentas() {
    return this.http.get(this.url + 'GetTipoCuentas').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  CrearCuenta(cuenta: ITipocuenta) {
    return this.http.post(this.url + 'PostTipoCuenta', cuenta).pipe(
      map((result: any) => {
        return result;
      }));
  }
  EliminaCuenta(cuenta: number) {
    return this.http.delete(this.url + 'DeleteTipoCuenta/' + cuenta).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  ActualizarCuenta(cuenta: ITipocuenta) {
    return this.http.post(this.url + 'PutTipoCuenta' +cuenta.TIC_CODIGO , cuenta).pipe(
      map((result: any) => {
        return result;
      }));
  }

}
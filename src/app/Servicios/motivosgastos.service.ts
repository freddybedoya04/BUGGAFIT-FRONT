import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { icategoria } from '../Interfaces/icategoria';
import { IMotivoGasto } from '../Interfaces/imotivo-gasto';
import { IApiResponse } from '../Interfaces/iapiresponse';
@Injectable({
  providedIn: 'root'
})
export class MotivosGastosService {

  url: string = "MotivosGastos/";
  constructor(private http: HttpClientService) { }

  ObtenerMotivosGastos() {
    return this.http.get<IApiResponse>(this.url + 'GetMotivoGasto').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  CrearMotivoGasto(MotivosGastos: IMotivoGasto) {
    return this.http.post<IApiResponse>(this.url + 'PostMotivoGasto', MotivosGastos).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  EliminarMotivoGasto(MotivosGastos: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteMotivoGasto/' + MotivosGastos).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

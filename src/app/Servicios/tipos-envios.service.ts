import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { ITiposEnvios } from '../Interfaces/tipos-envios';
import { IApiResponse } from '../Interfaces/iapiresponse';
@Injectable({
  providedIn: 'root'
})
export class TiposEnviosService {

  url: string = "TiposEnvios/";
  constructor(private http: HttpClientService) { }

  ObtenerTipoEnvios() {
    return this.http.get<IApiResponse>(this.url + 'GetTiposEnvios').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  CrearTipoEnvio(tipo: ITiposEnvios) {
    return this.http.post<IApiResponse>(this.url + 'PostTiposEnvios', tipo).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  ActualizarTipoEnvio(tipo: ITiposEnvios) {
    return this.http.put<IApiResponse>(this.url + 'PutTipoEnvios/' + tipo.TIP_CODIGO, tipo).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  EliminarTipoEnvio(tipo: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteTiposEnvios/' + tipo).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

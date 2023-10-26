import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { ITiposEnvios } from '../Interfaces/tipos-envios';
@Injectable({
  providedIn: 'root'
})
export class TiposEnviosService {

  url: string = "TiposEnvios/";
  constructor(private http: HttpClientService) { }

  ObtenerTipoEnvios() {
    return this.http.get(this.url + 'GetTiposEnvios').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  CrearTipoEnvio(tipo: ITiposEnvios) {
    return this.http.post(this.url + 'PostTiposEnvios', tipo).pipe(
      map((result: any) => {
        return result;
      }));
  }
  ActualizarTipoEnvio(tipo: ITiposEnvios) {
    return this.http.put(this.url + 'PutTipoEnvios/' + tipo.TIP_CODIGO, tipo).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  EliminarTipoEnvio(tipo: number) {
    return this.http.delete(this.url + 'DeleteTiposEnvios/' + tipo).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
}

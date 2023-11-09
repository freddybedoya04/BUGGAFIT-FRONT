import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { imarca } from '../Interfaces/imarca';
import { IApiResponse } from '../Interfaces/iapiresponse';
@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  url: string = "Marca/";
  constructor(private http: HttpClientService) { }

  ObtenerMarcas() {
    return this.http.get<IApiResponse>(this.url + 'GetMarcas').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  CrearMarca(marca: imarca) {
    return this.http.post<IApiResponse>(this.url + 'PostMarca', marca).pipe(
      map((result: IApiResponse) => {
        return result;
      }));
  }
  EliminarMarca(marca: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteMarca/' + marca).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

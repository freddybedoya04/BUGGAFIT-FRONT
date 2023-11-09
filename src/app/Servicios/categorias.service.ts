import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { icategoria } from '../Interfaces/icategoria';
import { IApiResponse } from '../Interfaces/iapiresponse';
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  url: string = "Categorias/";
  constructor(private http: HttpClientService) { }

  ObtenerCategorias() {
    return this.http.get<IApiResponse>(this.url + 'GetCategorias').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  CrearCategoria(categoria: icategoria) {
    return this.http.post<IApiResponse>(this.url + 'PostCategoria', categoria).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  EliminaCategoria(categoria: number) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteCategoria/' + categoria).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

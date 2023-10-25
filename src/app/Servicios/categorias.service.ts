import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { icategoria } from '../Interfaces/icategoria';
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  url: string = "Categorias/";
  constructor(private http: HttpClientService) { }

  ObtenerCategorias() {
    return this.http.get(this.url + 'GetCategorias').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  CrearCategoria(categoria: icategoria) {
    return this.http.post(this.url + 'PostCategoria', categoria).pipe(
      map((result: any) => {
        return result;
      }));
  }
  EliminaCategoria(categoria: number) {
    return this.http.delete(this.url + 'DeleteCategoria/' + categoria).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
}

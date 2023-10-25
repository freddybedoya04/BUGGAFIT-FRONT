import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
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
}

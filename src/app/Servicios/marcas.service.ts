import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { imarca } from '../Interfaces/imarca';
@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  url: string = "Marca/";
  constructor(private http: HttpClientService) { }

  ObtenerMarcas() {
    return this.http.get(this.url + 'GetMarcas').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  CrearMarca(marca: imarca) {
    return this.http.post(this.url + 'PostMarca', marca).pipe(
      map((result: any) => {
        return result;
      }));
  }
  EliminarMarca(marca: number) {
    return this.http.delete(this.url + 'DeleteMarca/' + marca).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
}

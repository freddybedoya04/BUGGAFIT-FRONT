import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { Iproducto } from '../Interfaces/iproducto';
import { icategoria } from '../Interfaces/icategoria';
import { IMotivoGasto } from '../Interfaces/imotivo-gasto';
@Injectable({
  providedIn: 'root'
})
export class MotivosGastosService {

  url: string = "MotivosGastos/";
  constructor(private http: HttpClientService) { }

  ObtenerMotivosGastos() {
    return this.http.get(this.url + 'GetMotivoGasto').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  CrearMotivoGasto(MotivosGastos: IMotivoGasto) {
    return this.http.post(this.url + 'PostMotivoGasto', MotivosGastos).pipe(
      map((result: any) => {
        return result;
      }));
  }
  EliminarMotivoGasto(MotivosGastos: number) {
    return this.http.delete(this.url + 'DeleteMotivoGasto/' + MotivosGastos).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
}

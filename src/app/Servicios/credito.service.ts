import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  url: string = "Credito/";
  constructor(private http: HttpClientService) { }

  ObtenerPersonasCredito() {
    return this.http.get(this.url + 'GetCreditos').pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }
  ObtenerCreditoCliente(id:string) {
    return this.http.get(this.url + 'GetCreditoCliente/'+id).pipe(
      map((result: any) => {
        return result.Data;
      })
    );
  }

}
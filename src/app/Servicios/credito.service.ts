import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, map } from 'rxjs';
import { IApiResponse } from '../Interfaces/iapiresponse';
@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  url: string = "Credito/";
  constructor(private http: HttpClientService) { }

  ObtenerPersonasCredito() {
    return this.http.get<IApiResponse>(this.url + 'GetCreditos').pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }
  ObtenerCreditoCliente(id:string) {
    return this.http.get<IApiResponse>(this.url + 'GetCreditoCliente/'+id).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      })
    );
  }

}

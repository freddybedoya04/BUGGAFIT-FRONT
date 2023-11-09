import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Icliente } from '../Interfaces/icliente';
import { IApiResponse } from '../Interfaces/iapiresponse';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url: string = "Clientes/";
  constructor(private http: HttpClientService) { }

  BuscarClientes() {
    return this.http.get<IApiResponse>(this.url + 'GetClientes').subscribe((result: IApiResponse) =>{
      return result.Data;
    });
  }
  BuscarClienteID(cliente: string) {
    return this.http.get<IApiResponse>(this.url + 'GetCliente/' + cliente).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  CrearCliente(cliente: Icliente) {
    return this.http.post<IApiResponse>(this.url + 'PostCliente', cliente).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  EliminarCliente(cliente: string) {
    return this.http.delete<IApiResponse>(this.url + 'DeleteCliente/' + cliente).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
  ActualizarCliente(codCliente: string, client: Icliente) {
    return this.http.put<IApiResponse>(this.url + 'PutCliente/' + codCliente, client).pipe(
      map((result: IApiResponse) => {
        return result.Data;
      }));
  }
}

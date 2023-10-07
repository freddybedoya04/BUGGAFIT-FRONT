import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Icliente } from '../Interfaces/icliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url: string = "Clientes/";
  constructor(private http: HttpClientService) { }

  BuscarClientes() {
    return this.http.get(this.url + 'GetClientes').subscribe((result: any) =>{
      return result.Data;
    });
  }
  BuscarClienteID(cliente: string) {
    return this.http.get(this.url + 'GetCliente/' + cliente).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  CrearCliente(cliente: Icliente) {
    return this.http.post(this.url + 'PostCliente', cliente).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  EliminarCliente(cliente: string) {
    return this.http.delete(this.url + 'DeleteCliente/' + cliente).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
  ActualizarCliente(cliente: string) {
    return this.http.put(this.url + 'PutCliente/' + cliente, cliente).pipe(
      map((result: any) => {
        return result.Data;
      }));
  }
}

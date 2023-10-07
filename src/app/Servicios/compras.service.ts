import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { IFiltro } from '../Interfaces/ifiltro';
import { Observable } from 'rxjs';
import { Icompras } from '../Interfaces/icompra';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  url:string="Compras/";
  constructor(private http:HttpClientService) { }

  BuscarCompraID(compra:Icompras):Observable<Icompras>{
    return this.http.get(this.url+compra.COM_CODIGO);
  }
  CrearCompra(compra:Icompras):Observable<any>{
    return this.http.post(this.url+'CrearCompra',compra);
  }
  EliminarCompra(compra:Icompras):Observable<any>{
    return this.http.delete(this.url+compra.COM_CODIGO);
  }
  ActualizarCompra(compra:Icompras):Observable<any>{
    return this.http.put(this.url+'ActualizarCompra',compra);
  }
  BuscarComprarPorFechas(filtro:IFiltro):Observable<Icompras[]>{
    return this.http.post(this.url+'ListarComprasPorFecha',filtro);
  }
}

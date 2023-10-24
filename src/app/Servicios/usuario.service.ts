import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable,map } from 'rxjs';
import { Iusuario } from '../Interfaces/iusuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string = "Usuarios/"; 
  constructor(private http: HttpClientService) { }

  AgregarUsuario(usuario: Iusuario): Observable<any> {
    return this.http.post(this.url + 'PostUsuario', usuario);
  }
  BuscarUsuarioPorCedula(cedula: string): Observable<Iusuario> {
    const url = `${this.url}BuscarUsuarioPorCedula/`+cedula;
    return this.http.get<Iusuario>(url);
  }
  EliminarUsuario(cedula: string): Observable<any> {
    return this.http.delete(this.url + cedula);
  }
  ActualizarUsuario(usuario:Iusuario):Observable<any>{
    return this.http.put(this.url+'PutUsuario',usuario);
  }

  ListarUsuarios(){
    return this.http.get(this.url + 'GetUsuarios').pipe(
      map((result: any) => {
        return result
      }));
  }
}

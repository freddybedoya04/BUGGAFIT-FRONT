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
  EliminarUsuario(cedula: string): Observable<any> {
    return this.http.delete(this.url + cedula);
  }
  ListarUsuarios(){
    return this.http.get(this.url + 'GetUsuarios').pipe(
      map((result: any) => {
        return result
      }));
  }
}

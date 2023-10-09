import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { map } from 'rxjs';
import { ILogin } from '../Interfaces/ilogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = "Login/";
  constructor(private http: HttpClientService) { }

  Login(login: ILogin) {
    return this.http.post(this.url, login).pipe(
      map((result: any) => {
        return result;
      }));
  }
}

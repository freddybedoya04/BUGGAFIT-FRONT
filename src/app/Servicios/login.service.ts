import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ILogin } from '../Interfaces/ilogin';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = "Login/";
  private user: any;
  private _loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClientService,
    private router: Router,
  ) {
    const session = localStorage.getItem('user');
    if (session) {
      //TODO: agregar la validacion del token, cuando ya este expirado se cierra la sesion
      this._loggedIn.next(true);
    }
  }

  get userValue() {
    return this.user;
  }
  get isLoggedIn$(): Observable<boolean> {
    return this._loggedIn.asObservable();
  }

  Login(login: ILogin) {
    return this.http.post(this.url, login).pipe(
      map((result: any) => {
        this.saveLocalStorage(result.Data, result.token);
        this._loggedIn.next(true);
        return result;
      }));
  }

  private saveLocalStorage(user: any, token: string): void {
    const rest = user;
    const JWTtoken = token;
    localStorage.setItem('user', JSON.stringify(rest));
    localStorage.setItem('token', JWTtoken);
  }

  logout(): void {
    localStorage.clear();
    this._loggedIn.next(false);
    this.router.navigate(['/login']);
    location.reload();
  }
}

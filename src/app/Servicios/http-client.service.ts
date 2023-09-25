import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/Environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {

  }

  // Método para realizar una solicitud GET
  get<T>(url: string): Observable<T> {

    return this.http.get<T>(this.apiUrl+url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para realizar una solicitud POST
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.apiUrl+url, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }
  // Método para realizar una solicitud PUT
  put<T>(url: string, body: any): Observable<T> {

    return this.http.put<T>(this.apiUrl+url, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }
  // Método para realizar una solicitud DELETE
  delete<T>(url: string): Observable<T> {

    return this.http.delete<T>(this.apiUrl+url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El servidor devolvió un código de error
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.error.message || error.message}`;
    }

    // Puedes personalizar el manejo de errores según tus necesidades
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url: string = "Dashboard/";

  constructor(private http: HttpClientService) { }

  buscarDashboard(fechaInicio: string, fechaFin: string): Observable<any> {
    const body = {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin
    };

    return this.http.post(this.url + 'GetDashboard', body);
  }
}

import { Component } from '@angular/core';
import { AlertasService } from './Servicios/alertas.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BUGGAFIT-FRONT';
  constructor(public alerta: AlertasService) { }
}

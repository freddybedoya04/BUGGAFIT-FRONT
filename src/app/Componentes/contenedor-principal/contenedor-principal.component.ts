import { Component } from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-contenedor-principal',
  templateUrl: './contenedor-principal.component.html',
  styleUrls: ['./contenedor-principal.component.scss']
})
export class ContenedorPrincipalComponent {
  isCollapsed = false; // Inicialmente la barra no está colapsada

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  
}

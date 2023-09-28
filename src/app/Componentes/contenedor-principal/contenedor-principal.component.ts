import { Component } from '@angular/core';

@Component({
  selector: 'app-contenedor-principal',
  templateUrl: './contenedor-principal.component.html',
  styleUrls: ['./contenedor-principal.component.scss']
})
export class ContenedorPrincipalComponent {
  isCollapsed = false;
  selectedLink = '';
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  selectLink(linkName: string) {
    this.selectedLink = linkName;
  }

}

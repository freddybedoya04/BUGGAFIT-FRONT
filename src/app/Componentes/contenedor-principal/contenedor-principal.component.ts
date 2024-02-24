import { Component, OnInit } from '@angular/core';
import { Ipantallapermiso } from 'src/app/Interfaces/ipantallapermiso';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import{ BreakpointObserver } from '@angular/cdk/layout'

@Component({
  selector: 'app-contenedor-principal',
  templateUrl: './contenedor-principal.component.html',
  styleUrls: ['./contenedor-principal.component.scss']
})
export class ContenedorPrincipalComponent implements OnInit {
  userLogged: any;
  pantallas: Ipantallapermiso[] = [];
  constructor(private usuarioService: UsuarioService,
    private alertasService: AlertasService,
    private observer:BreakpointObserver) {
    this.userLogged = JSON.parse(localStorage.getItem('user') || "");
  }
  ngAfterViewInit(){
    this.observer.observe(['(max-width: 1100px)']).subscribe((res)=>{
      if(res.matches){
        this.isCollapsed=true;
      }else{
        this.isCollapsed=false;
      }
    })
  }
  ngOnInit(): void {

    this.ListarPermisosPorPerfil()
  }
  isCollapsed = false;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  CerrarSesion() {
    localStorage.clear();
    location.reload();
  }
  ListarPermisosPorPerfil() {
    this.userLogged;
    this.alertasService.showLoading("Cargando pantallas")
    this.usuarioService.ListarPantallasPermisos(this.userLogged.USU_ROL).subscribe((x: Ipantallapermiso[]) => {
      this.alertasService.hideLoading();
      this.pantallas = x.filter(p => p.PPP_VER == true);
      localStorage.setItem('pantallas', JSON.stringify(this.pantallas));

    }, err => {
      this.alertasService.hideLoading()
      this.alertasService.SetToast("error al cargar las pantallas", 3)
    })
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { VentasComponent } from './Paginas/ventas/ventas.component';
import { ComprasComponent } from './Paginas/compras/compras.component';
import { AuthenticationGuard } from './Servicios/authentication-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // {path:'**',redirectTo:'login',pathMatch:'full'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'principal',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('./Componentes/contenedor-principal/contenedor-principal.module').then(x => x.ContenedorPrincipalModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

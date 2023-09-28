import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenedorPrincipalComponent } from './contenedor-principal.component';
import { VentasComponent } from 'src/app/Paginas/ventas/ventas.component';
import { ComprasComponent } from 'src/app/Paginas/compras/compras.component';
import { GastosComponent } from 'src/app/Paginas/gastos/gastos.component';
import { ReportesComponent } from 'src/app/Paginas/reportes/reportes.component';
import { InventarioComponent } from 'src/app/Paginas/inventario/inventario.component';
import { EstadisticasComponent } from 'src/app/Paginas/estadisticas/estadisticas.component';
import { UsuariosComponent } from 'src/app/Paginas/usuarios/usuarios.component';
import { CreacionCompraComponent } from 'src/app/Modales/creacion-compra/creacion-compra.component';

const routes: Routes = [
  {path:'',component:ContenedorPrincipalComponent,children:[
    {path:'',redirectTo:'ventas', pathMatch:'full'},
    {path:'ventas',component:VentasComponent},
    {path:'compras',component:ComprasComponent},
    {path:'gastos',component:GastosComponent},
    {path:'reportes',component:ReportesComponent},
    {path:'inventario',component:InventarioComponent},
    {path:'estadisticas',component:EstadisticasComponent},
    {path:'usuarios',component:UsuariosComponent}
  ]}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContenedorPrincipalRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContenedorPrincipalRoutingModule } from './contenedor-principal-routing.module';

import { SharedModule } from 'src/app/Shared/shared/shared.module';

import { ContenedorPrincipalComponent } from './contenedor-principal.component';
import { ComprasComponent } from '../../Paginas/compras/compras.component';
import { GastosComponent } from '../../Paginas/gastos/gastos.component';
import { ReportesComponent } from '../../Paginas/reportes/reportes.component';
import { InventarioComponent } from '../../Paginas/inventario/inventario.component';
import { UsuariosComponent } from '../../Paginas/usuarios/usuarios.component';
import { EstadisticasComponent } from '../../Paginas/estadisticas/estadisticas.component';
import { VentasComponent } from 'src/app/Paginas/ventas/ventas.component';
import { CreacionCompraComponent } from 'src/app/Modales/creacion-compra/creacion-compra.component';
import { CreacionProductoComponent } from 'src/app/Modales/creacion-producto/creacion-producto.component';
import { CreacionUsuarioComponent } from 'src/app/Modales/creacion-usuario/creacion-usuario.component';
import { DetalleVentasComponent } from 'src/app/Modales/detalle-ventas/detalle-ventas.component';
import { AbonosComponent } from 'src/app/Modales/abonos/abonos.component';
import { ConfiguracionesComponent } from 'src/app/Paginas/configuraciones/configuraciones.component';
import { CreacionGastoComponent } from 'src/app/Modales/creacion-gasto/creacion-gasto.component';
@NgModule({
  declarations: [
    ContenedorPrincipalComponent,
    VentasComponent,
    ComprasComponent,
    GastosComponent,
    ReportesComponent,
    InventarioComponent,
    UsuariosComponent,
    EstadisticasComponent,
    CreacionCompraComponent,
    CreacionProductoComponent,
    DetalleVentasComponent,
    AbonosComponent,
    CreacionUsuarioComponent,
    ConfiguracionesComponent,
    CreacionGastoComponent

  ],
  imports: [
    CommonModule,
    ContenedorPrincipalRoutingModule,
    SharedModule
  ]
})
export class ContenedorPrincipalModule { }

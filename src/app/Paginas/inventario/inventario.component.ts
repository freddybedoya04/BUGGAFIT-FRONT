import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CreacionProductoComponent } from 'src/app/Modales/creacion-producto/creacion-producto.component';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { AlertasService } from 'src/app/Servicios/alertas.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  constructor(private dialogService: DialogService,private alertas: AlertasService) 
  
  { 
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
  }
}
ConfigurarFechas() {
  this.FechaFin = new Date();
  this.FechaInicio = new Date(this.FechaFin)
  this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
}

  AbrirModalProductos() {
    let ref = this.dialogService.open(CreacionProductoComponent, {
      header: 'Nuevo Producto', 
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: false } 
    });
  }
}

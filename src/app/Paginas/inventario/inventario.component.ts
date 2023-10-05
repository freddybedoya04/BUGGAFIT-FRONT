import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CreacionProductoComponent } from 'src/app/Modales/creacion-producto/creacion-producto.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent {
  constructor(private dialogService: DialogService) { }

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

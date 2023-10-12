import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CreacionProductoComponent } from 'src/app/Modales/creacion-producto/creacion-producto.component';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { Iproducto } from 'src/app/Interfaces/iproducto';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  FechaInicio: Date;
  FechaFin: Date;
  filtro: IFiltro;
  listaProductos: Iproducto[] = [];
  public searchKeyword: string = '';
  

  constructor(
    private dialogService: DialogService,
    private alertasService: AlertasService,
    private inventarioService: InventarioService,
    ) {
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
    }
  
  }
  ngOnInit(){
    this.BuscarProductos();  }
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
  };
  BuscarProductos() {
    this.inventarioService.BuscarProductos().subscribe((result: any)=>{
      if (!result || result === null) {// en caso que llege vacio el producto
        // Agregar mensaje de error
        this.alertasService.SetToast("No hay Productos para mostrar.", 2);
        return;
      }
      this.listaProductos = result;
    });

  }
}


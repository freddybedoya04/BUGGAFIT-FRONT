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
  ngOnInit() {
    this.BuscarProductos();
    this.ConfigurarFechas();
  }
  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 30);
  }

  AbrirModalProductos() {
    let ref = this.dialogService.open(CreacionProductoComponent, {
      header: 'Nuevo Producto',
      width: '60%',
      contentStyle: { overflow: 'auto','background-color':'#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: false }
    });
    ref.onClose.subscribe((res) => {

      this.BuscarProductos();
    });
  };
  BuscarProductos() {
    this.alertasService.showLoading("Cargando productos")
    this.inventarioService.BuscarProductos().subscribe((result: any) => {
      this.alertasService.hideLoading();
      if (!result || result === null) {// en caso que llege vacio el producto
        // Agregar mensaje de error
        this.alertasService.SetToast("No hay Productos para mostrar.", 2);
        return;
      }
      this.listaProductos = result.map((item: Iproducto) => {
        item.EstaEnAlerta = item.PRO_UNIDADES_DISPONIBLES < item.PRO_UNIDADES_MINIMAS_ALERTA;
        return item;
      });
    },err=>{
      this.alertasService.hideLoading();
      this.alertasService.SetToast('Error al buscar los productos',3)
      console.log(err)
    });
  }

  EditarProducto(producto: Iproducto) {
    let ref = this.dialogService.open(CreacionProductoComponent, {
      header: 'Editar Producto',
      width: '60%',
      contentStyle: { overflow: 'auto','background-color':'#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: true, productoAEditar: producto }
    });
    ref.onClose.subscribe((res) => {
      this.BuscarProductos();
    });
  };

  BorrarProducto(producto: Iproducto) {
    alert("Se eliminara el producto seleccionado")
    if (producto.PRO_CODIGO == null || producto.PRO_CODIGO === '') {
      this.alertasService.SetToast('El producto no puede tener el codigo vacio', 3);
      return;
    }
    this.alertasService.confirmacion("Desea eliminar el prodcuto con codigo: " + producto.PRO_CODIGO).then(
      (resolve: any)=>{
        if(resolve){
          this.alertasService.showLoading('Eliminando el producto');
          this.inventarioService.EliminarProducto(producto.PRO_CODIGO).subscribe((result) => {
            if (result == null || result?.StatusCode.toString().indexOf('20') >= 0) {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Producto Eliminado', 1);
              this.BuscarProductos();
            }
            else {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al eliminar el producto: ' + result?.Message, 3);
              console.error(result);
            }
          });
        }
      })
  }
}


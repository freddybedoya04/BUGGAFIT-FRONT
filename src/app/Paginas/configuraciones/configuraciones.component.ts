import { Component, OnInit } from '@angular/core';
import { icategoria } from 'src/app/Interfaces/icategoria';
import { imarca } from 'src/app/Interfaces/imarca';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { CategoriasService } from 'src/app/Servicios/categorias.service';
import { MarcasService } from 'src/app/Servicios/marcas.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss']
})
export class ConfiguracionesComponent implements OnInit {
  marcas: imarca[] = [];
  Marca: imarca;
  ActivarFormularioMarca: boolean = false;
  categorias: icategoria[] = [];
  Categoria: icategoria;
  ActivarFormularioCategoria: boolean = false;
  envios = [];
  envio = [];
  cuentas = [];
  constructor(private marcasSevice: MarcasService,
    private categoriasService: CategoriasService,
    private ventasService: VentasService,
    private alertasService: AlertasService) {
    this.Marca = {
      MAR_CODIGO: 0,
      MAR_NOMBRE: "",
      MAR_FECHACREACION: new Date(),
      MAR_ESTADO: true,
    }
    this.Categoria = {
      CAT_CODIGO: 0,
      CAT_NOMBRE: "",
      CAT_FECHACREACION: new Date(),
      CAT_ESTADO: false,
    }

  }
  ngOnInit(): void {
    this.CargarMarcas();
    this.CargarCategorias();
    this.CargarCuentas();
  }
  //#region cargue de tablas
  CargarMarcas() {
    this.alertasService.showLoading('Cargando marcas')
    this.marcasSevice.ObtenerMarcas().subscribe(x => {
      this.alertasService.hideLoading();
      this.marcas = x;
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast('Error al consultar las marcas', 3)
    })
  }
  CargarCategorias() {
    this.alertasService.showLoading('Cargando categorias')
    this.categoriasService.ObtenerCategorias().subscribe(x => {
      this.alertasService.hideLoading();
      this.categorias = x;
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast('Error al consultar las categorias', 3)
    })
  }
  CargarCuentas() {
    this.alertasService.showLoading('Cargando tipos de cuentas')
    this.ventasService.BuscarTipoCuentas().subscribe(x => {
      this.alertasService.hideLoading();
      this.cuentas = x;
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast('Error al consultar las cuentas', 3)
    })
  }
  //#endregion

  //#region Creacion
  AgregarMarca(){
    this.Marca.MAR_NOMBRE=this.Marca.MAR_NOMBRE.toLocaleUpperCase().trim();
    if(this.Marca.MAR_NOMBRE==""){
      this.alertasService.SetToast("Debe llenar el campo nombre marca",2);
      return;
    }
    if(this.marcas.find(x=>x.MAR_NOMBRE.toLocaleUpperCase()==this.Marca.MAR_NOMBRE)){
      this.alertasService.SetToast("Ya existe una marca con este nombre",2);
      return;
    }
    this
    this.alertasService.showLoading("Creando marca");
    this.marcasSevice.CrearMarca(this.Marca).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioMarca=false;
      this.Marca.MAR_NOMBRE="";
      this.CargarMarcas();
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }
  //#endregion
  //#region Eliminacion
  EliminarMarca(marca:imarca){
    this.alertasService.showLoading("Eliminando marca");
    this.marcasSevice.EliminarMarca(marca.MAR_CODIGO).subscribe(x => {
      this.alertasService.hideLoading();
      this.CargarMarcas();
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast("Error al  eliminar marca", 3)
    })
  }
  //#endregion
  //#region Edicion
  //#endregion
}

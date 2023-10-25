import { Component, OnInit } from '@angular/core';
import { icategoria } from 'src/app/Interfaces/icategoria';
import { imarca } from 'src/app/Interfaces/imarca';
import { IMotivoGasto } from 'src/app/Interfaces/imotivo-gasto';
import { ITipocuenta } from 'src/app/Interfaces/itipocuenta';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { CategoriasService } from 'src/app/Servicios/categorias.service';
import { MarcasService } from 'src/app/Servicios/marcas.service';
import { MotivosGastosService } from 'src/app/Servicios/motivosgastos.service';
import { TipoCuentaService } from 'src/app/Servicios/tipocuenta.service';
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
  cuentas:ITipocuenta[]=[];
  Cuenta:ITipocuenta;
  ActivarFormularioCuenta: boolean = false;
  motivos:IMotivoGasto[]=[];
  MotivoGasto:IMotivoGasto;
  ActivarFormularioMotivoGasto:boolean=false;
  envios = [];
  envio = [];

  constructor(private marcasSevice: MarcasService,
    private categoriasService: CategoriasService,
    private tipoCuentaService:TipoCuentaService,
    private motivoGastoService:MotivosGastosService,
    private alertasService: AlertasService) {
    this.Marca = {
      MAR_CODIGO: 0,
      MAR_NOMBRE: "",
      MAR_FECHACREACION: new Date(),
      MAR_ESTADO: true,
    };
    this.Categoria = {
      CAT_CODIGO: 0,
      CAT_NOMBRE: "",
      CAT_FECHACREACION: new Date(),
      CAT_ESTADO: false,
    };
    this.Cuenta={
      TIC_CODIGO: 0,
      TIC_NOMBRE: "",
      TIC_NUMEROREFERENCIA: 0,
      TIC_FECHACREACION: new Date(),
      TIC_ESTADO: false,
    };
    this.MotivoGasto={
      MOG_CODIGO: 0,
      MOG_NOMBRE: "",
      MOG_FECHACREACION: new Date(),
      MOG_ESTADO: false,
    }

  }
  ngOnInit(): void {
    this.CargarCategorias();
    this.CargarCuentas();
    this.CargarMotivosGastos();
    this.CargarMarcas();
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
    this.tipoCuentaService.ObtenerCuentas().subscribe(x => {
      this.alertasService.hideLoading();
      this.cuentas = x;
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast('Error al consultar las cuentas', 3)
    })
  }
  CargarMotivosGastos() {
    this.alertasService.showLoading('Cargando MotivosGastos')
    this.motivoGastoService.ObtenerMotivosGastos().subscribe(x => {
      this.alertasService.hideLoading();
      this.motivos = x;
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast('Error al consultar las motivos de gasto', 3)
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
      this.alertasService.SetToast("Se creó marca correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarCategoria(){
    this.Categoria.CAT_NOMBRE=this.Categoria.CAT_NOMBRE.toLocaleUpperCase().trim();
    if(this.Categoria.CAT_NOMBRE==""){
      this.alertasService.SetToast("Debe llenar el campo nombre categoria",2);
      return;
    }
    if(this.categorias.find(x=>x.CAT_NOMBRE.toLocaleUpperCase()==this.Categoria.CAT_NOMBRE)){
      this.alertasService.SetToast("Ya existe una categoria con este nombre",2);
      return;
    }
    this
    this.alertasService.showLoading("Creando categoria");
    this.categoriasService.CrearCategoria(this.Categoria).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioCategoria=false;
      this.Categoria.CAT_NOMBRE="";
      this.CargarCategorias();
      this.alertasService.SetToast("Se creó categoria correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarCuenta(){
    this.Cuenta.TIC_NOMBRE=this.Cuenta.TIC_NOMBRE.toLocaleUpperCase().trim();
    if(this.Cuenta.TIC_NOMBRE==""){
      this.alertasService.SetToast("Debe llenar el campo nombre cuenta",2);
      return;
    }
    if(this.cuentas.find(x=>x.TIC_NOMBRE.toLocaleUpperCase()==this.Cuenta.TIC_NOMBRE)){
      this.alertasService.SetToast("Ya existe una cuenta con este nombre",2);
      return;
    }
    if(this.cuentas.find(x=>x.TIC_NUMEROREFERENCIA==this.Cuenta.TIC_NUMEROREFERENCIA)){
      this.alertasService.SetToast("Ya existe una cuenta con este numero de refereencia",2);
      return;
    }
    this
    this.alertasService.showLoading("Creando cuenta");
    this.tipoCuentaService.CrearCuenta(this.Cuenta).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioCuenta=false;
      this.Cuenta.TIC_NOMBRE="";
      this.Cuenta.TIC_NUMEROREFERENCIA=0;
      this.CargarCuentas();
      this.alertasService.SetToast("Se creó cuenta correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarMotivoGasto(){
    this.MotivoGasto.MOG_NOMBRE=this.MotivoGasto.MOG_NOMBRE.toLocaleUpperCase().trim();
    if(this.MotivoGasto.MOG_NOMBRE==""){
      this.alertasService.SetToast("Debe llenar el campo nombre cuenta",2);
      return;
    }
    if(this.motivos.find(x=>x.MOG_NOMBRE.toLocaleUpperCase()==this.MotivoGasto.MOG_NOMBRE)){
      this.alertasService.SetToast("Ya existe una cuenta con este nombre",2);
      return;
    }
    this
    this.alertasService.showLoading("Creando motivo de gasto.");
    this.motivoGastoService.CrearMotivoGasto(this.MotivoGasto).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioMotivoGasto=false;
      this.MotivoGasto.MOG_NOMBRE="";
      this.CargarMotivosGastos();
      this.alertasService.SetToast("Se creó motivo de gasto correctamente", 1)
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
      this.alertasService.SetToast("Se eliminó marca correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast("Error al  eliminar marca", 3)
    })
  }
  EliminarCategoria(categoria:icategoria){
    this.alertasService.showLoading("Eliminando categoria");
    this.categoriasService.EliminaCategoria(categoria.CAT_CODIGO).subscribe(x => {
      this.alertasService.hideLoading();
      this.CargarCategorias();
      this.alertasService.SetToast("Se eliminó categoria correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast("Error al  eliminar categoria", 3)
    })
  }
  EliminarCuenta(cuenta:ITipocuenta){
    this.alertasService.showLoading("Eliminando cuenta");
    this.tipoCuentaService.EliminaCuenta(cuenta.TIC_CODIGO).subscribe(x => {
      this.alertasService.hideLoading();
      this.CargarCuentas();
      this.alertasService.SetToast("Se eliminó cuenta correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast("Error al  eliminar cuenta", 3)
    })
  }

  EliminarMotivoGasto(motivo:IMotivoGasto){
    this.alertasService.showLoading("Eliminando motivo de gasto");
    this.motivoGastoService.EliminarMotivoGasto(motivo.MOG_CODIGO).subscribe(x => {
      this.alertasService.hideLoading();
      this.CargarMotivosGastos();
      this.alertasService.SetToast("Se eliminó motivo correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast("Error al  eliminar motivo", 3)
    })
  }
  //#endregion
  //#region Edicion
  //#endregion
}

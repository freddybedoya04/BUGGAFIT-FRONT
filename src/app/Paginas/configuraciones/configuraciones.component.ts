import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { icategoria } from 'src/app/Interfaces/icategoria';
import { imarca } from 'src/app/Interfaces/imarca';
import { IMotivoGasto } from 'src/app/Interfaces/imotivo-gasto';
import { ITipocuenta } from 'src/app/Interfaces/itipocuenta';
import { ITiposEnvios } from 'src/app/Interfaces/tipos-envios';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { CategoriasService } from 'src/app/Servicios/categorias.service';
import { MarcasService } from 'src/app/Servicios/marcas.service';
import { MotivosGastosService } from 'src/app/Servicios/motivosgastos.service';
import { TipoCuentaService } from 'src/app/Servicios/tipocuenta.service';
import { TiposEnviosService } from 'src/app/Servicios/tipos-envios.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss']
})
export class ConfiguracionesComponent implements OnInit {

  @ViewChild("InputNombreCuenta") InputNombreCuenta: any;
  marcas: imarca[] = [];
  Marca: imarca;
  ActivarFormularioMarca: boolean = false;
  categorias: icategoria[] = [];
  Categoria: icategoria;
  ActivarFormularioCategoria: boolean = false;
  cuentas: ITipocuenta[] = [];
  Cuenta: ITipocuenta;
  ActivarFormularioCuenta: boolean = false;
  motivos: IMotivoGasto[] = [];
  MotivoGasto: IMotivoGasto;
  ActivarFormularioMotivoGasto: boolean = false;
  envios: ITiposEnvios[] = [];
  Envio: ITiposEnvios;
  ActivarFormularioTipoEnvio: boolean = false;
  constructor(private marcasSevice: MarcasService,
    private categoriasService: CategoriasService,
    private tipoCuentaService: TipoCuentaService,
    private motivoGastoService: MotivosGastosService,
    private tiposEnviosService: TiposEnviosService,
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
    this.Cuenta = {
      TIC_CODIGO: 0,
      TIC_NOMBRE: "",
      TIC_NUMEROREFERENCIA: 0,
      TIC_DINEROTOTAL: 0,
      TIC_FECHACREACION: new Date(),
      TIC_ESTADO: false,
      TIC_ESTIPOENVIO:false
    };
    this.MotivoGasto = {
      MOG_CODIGO: 0,
      MOG_NOMBRE: "",
      MOG_FECHACREACION: new Date(),
      MOG_ESTADO: false,
    };
    this.Envio = {
      TIP_CODIGO: 0,
      TIP_NOMBRE: "",
      TIP_VALOR: 0,
      TIP_TIMESPAN: new Date(),
      TIP_ESTADO: false,
    }

  }
  ngOnInit(): void {
    this.CargarCategorias();
    this.CargarCuentas();
    this.CargarMotivosGastos();
    this.CargarTipsEnvios();
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
  CargarTipsEnvios() {
    this.alertasService.showLoading('Cargando tipos  de envio')
    this.tiposEnviosService.ObtenerTipoEnvios().subscribe(x => {
      this.alertasService.hideLoading();
      this.envios = x;
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast('Error al consultar los tipos de envio', 3)
    })
  }
  //#endregion

  //#region Creacion
  AgregarMarca() {
    this.Marca.MAR_NOMBRE = this.Marca.MAR_NOMBRE.toLocaleUpperCase().trim();
    if (this.Marca.MAR_NOMBRE == "") {
      this.alertasService.SetToast("Debe llenar el campo nombre marca", 2);
      return;
    }
    if (this.marcas.find(x => x.MAR_NOMBRE.toLocaleUpperCase() == this.Marca.MAR_NOMBRE)) {
      this.alertasService.SetToast("Ya existe una marca con este nombre", 2);
      return;
    }
    this.alertasService.showLoading("Creando marca");
    this.marcasSevice.CrearMarca(this.Marca).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioMarca = false;
      this.Marca.MAR_NOMBRE = "";
      this.CargarMarcas();
      this.alertasService.SetToast("Se creó marca correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarCategoria() {
    this.Categoria.CAT_NOMBRE = this.Categoria.CAT_NOMBRE.toLocaleUpperCase().trim();
    if (this.Categoria.CAT_NOMBRE == "") {
      this.alertasService.SetToast("Debe llenar el campo nombre categoria", 2);
      return;
    }
    if (this.categorias.find(x => x.CAT_NOMBRE.toLocaleUpperCase() == this.Categoria.CAT_NOMBRE)) {
      this.alertasService.SetToast("Ya existe una categoria con este nombre", 2);
      return;
    }
    this.alertasService.showLoading("Creando categoria");
    this.categoriasService.CrearCategoria(this.Categoria).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioCategoria = false;
      this.Categoria.CAT_NOMBRE = "";
      this.CargarCategorias();
      this.alertasService.SetToast("Se creó categoria correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarCuenta() {
    this.Cuenta.TIC_NOMBRE = this.Cuenta.TIC_NOMBRE.toLocaleUpperCase().trim();
    if (this.Cuenta.TIC_NOMBRE == "") {
      this.alertasService.SetToast("Debe llenar el campo nombre cuenta", 2);
      return;
    }
    if (this.cuentas.find(x => x.TIC_NOMBRE.toLocaleUpperCase() == this.Cuenta.TIC_NOMBRE)) {
      this.alertasService.SetToast("Ya existe una cuenta con este nombre", 2);
      return;
    }
    if (this.cuentas.find(x => x.TIC_NUMEROREFERENCIA == this.Cuenta.TIC_NUMEROREFERENCIA)) {
      this.alertasService.SetToast("Ya existe una cuenta con este numero de refereencia", 2);
      return;
    }
    if (this.Cuenta.TIC_DINEROTOTAL == null) {
      this.alertasService.SetToast("No puede dejar el valor dinero total en blanco", 2);
      return;
    }


    this.alertasService.showLoading("Creando cuenta");
    this.tipoCuentaService.CrearCuenta(this.Cuenta).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioCuenta = false;
      this.Cuenta.TIC_NOMBRE = "";
      this.Cuenta.TIC_NUMEROREFERENCIA = 0;
      this.Cuenta.TIC_DINEROTOTAL = 0;
      this.Cuenta.TIC_ESTIPOENVIO=false;
      this.CargarCuentas();
      this.alertasService.SetToast("Se creó cuenta correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarMotivoGasto() {
    this.MotivoGasto.MOG_NOMBRE = this.MotivoGasto.MOG_NOMBRE.toLocaleUpperCase().trim();
    if (this.MotivoGasto.MOG_NOMBRE == "") {
      this.alertasService.SetToast("Debe llenar el campo nombre cuenta", 2);
      return;
    }
    if (this.motivos.find(x => x.MOG_NOMBRE.toLocaleUpperCase() == this.MotivoGasto.MOG_NOMBRE)) {
      this.alertasService.SetToast("Ya existe una cuenta con este nombre", 2);
      return;
    }
    this.alertasService.showLoading("Creando motivo de gasto.");
    this.motivoGastoService.CrearMotivoGasto(this.MotivoGasto).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioMotivoGasto = false;
      this.MotivoGasto.MOG_NOMBRE = "";
      this.CargarMotivosGastos();
      this.alertasService.SetToast("Se creó motivo de gasto correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  AgregarTipoEnvio() {
    this.Envio.TIP_NOMBRE = this.Envio.TIP_NOMBRE.toLocaleUpperCase().trim();
    if (this.Envio.TIP_NOMBRE == "") {
      this.alertasService.SetToast("Debe llenar el campo nombre envio", 2);
      return;
    }
    if (this.envios.find(x => x.TIP_NOMBRE.toLocaleUpperCase() == this.Envio.TIP_NOMBRE)) {
      this.alertasService.SetToast("Ya existe una envio con este nombre", 2);
      return;
    }
    this.alertasService.showLoading("Creando tipo envio.");
    this.tiposEnviosService.CrearTipoEnvio(this.Envio).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioTipoEnvio = false;
      this.Envio.TIP_NOMBRE = "";
      this.Envio.TIP_CODIGO = 0;
      this.Envio.TIP_VALOR = 0;
      this.CargarTipsEnvios();
      this.alertasService.SetToast("Se creó el tipo de envio correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }
  //#endregion
  //#region Eliminacion
  EliminarMarca(marca: imarca) {
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
  EliminarCategoria(categoria: icategoria) {
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
  EliminarCuenta(cuenta: ITipocuenta) {
    this.alertasService.confirmacion("Esta seguro de eliminar la cuenta "+ cuenta.TIC_NOMBRE + "?\nESTA ACCION ELIMINA EL DINERO Y NO ES REVERSIBLE.")
    .then(result => {
      if (result) {
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
    })
  }

  EliminarMotivoGasto(motivo: IMotivoGasto) {
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
  ActualizarTipoEnvio() {
    if (this.Envio.TIP_VALOR == null) {
      this.alertasService.SetToast("Debe llenar el campo valor", 2);
      return;
    }
    this.alertasService.showLoading("Actuaizando tipo de gasto.");
    this.tiposEnviosService.ActualizarTipoEnvio(this.Envio).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioTipoEnvio = false;
      this.Envio.TIP_VALOR = 0;
      this.Envio.TIP_CODIGO = 0;
      this.CargarTipsEnvios();
      this.alertasService.SetToast("Se modificó el tipo de envio correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }

  ActualizarTipoCuenta() {
    if (this.Cuenta.TIC_DINEROTOTAL == null) {
      this.alertasService.SetToast("Debe llenar el campo Dinero total", 2);
      return;
    }
    if (this.Cuenta.TIC_NUMEROREFERENCIA == null) {
      this.alertasService.SetToast("Debe llenar el campo numero de referencia", 2);
      return;
    }
    this.alertasService.showLoading("Actuaizando tipo de Cuenta.");
    this.tipoCuentaService.ActualizarCuenta(this.Cuenta).subscribe(x => {
      this.alertasService.hideLoading();
      this.ActivarFormularioCuenta = false;
      this.Cuenta.TIC_CODIGO = 0;
      this.Cuenta.TIC_NUMEROREFERENCIA = 0;
      this.Cuenta.TIC_DINEROTOTAL = 0;
      this.Cuenta.TIC_ESTIPOENVIO=false;
      this.CargarCuentas();
      this.alertasService.SetToast("Se modificó el tipo de cuenta correctamente", 1)
    }, err => {
      this.alertasService.hideLoading();
      console.log(err);
      this.alertasService.SetToast(err, 3)
    })
  }
  //#endregion
  PonerEnFormulario(envio: ITiposEnvios) {
    this.Envio = {
      TIP_CODIGO: envio.TIP_CODIGO,
      TIP_NOMBRE: envio.TIP_NOMBRE,
      TIP_VALOR: envio.TIP_VALOR,
      TIP_TIMESPAN: new Date(),
      TIP_ESTADO: true,
    }
    this.ActivarFormularioTipoEnvio = true;
  }
  PonerEnFormularioTipoCuenta(cuenta: ITipocuenta) {
    this.ActivarFormularioCuenta = true;
    this.Cuenta = {
      TIC_CODIGO: cuenta.TIC_CODIGO,
      TIC_NOMBRE: cuenta.TIC_NOMBRE,
      TIC_NUMEROREFERENCIA: cuenta.TIC_NUMEROREFERENCIA,
      TIC_DINEROTOTAL: cuenta.TIC_DINEROTOTAL,
      TIC_ESTADO: true,
      TIC_FECHACREACION: new Date(),
      TIC_ESTIPOENVIO:cuenta.TIC_ESTIPOENVIO
    }
    this.InputNombreCuenta?.nativeElement.focus();
  }

  getSeverity(estado: boolean) {
    switch (estado) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }
}

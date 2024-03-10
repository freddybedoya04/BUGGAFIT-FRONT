import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm, Form } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { Icliente } from 'src/app/Interfaces/icliente';
import { IDetalleVentas } from 'src/app/Interfaces/idetalle-ventas';
import { IGasto } from 'src/app/Interfaces/igasto';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { Iventa } from 'src/app/Interfaces/iventa';
import { ITiposEnvios } from 'src/app/Interfaces/tipos-envios';
import { CotizacionComponent } from 'src/app/Modales/cotizacion/cotizacion.component';
import { DetalleVentasComponent } from 'src/app/Modales/detalle-ventas/detalle-ventas.component';
import { PagoEnvioComponent } from 'src/app/Modales/pago-envio/pago-envio.component';
import { ValidarUsuarioAdminComponent } from 'src/app/Modales/validar-usuario-admin/validar-usuario-admin.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { ClientesService } from 'src/app/Servicios/clientes.service';
import { GastosService } from 'src/app/Servicios/gastos.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { MotivosGastosService } from 'src/app/Servicios/motivosgastos.service';
import { TiposEnviosService } from 'src/app/Servicios/tipos-envios.service';
import { VentasService } from 'src/app/Servicios/ventas.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { LiteralArray } from '@angular/compiler';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit {

  @ViewChild("codigoProdcutoInput") codigoProdcutoInput!: ElementRef;
  @ViewChild("tipoDeEnvioDropdown") tipoDeEnvioDropdown!: Dropdown;
  @ViewChild("cantidadInput") cantidadInput!: ElementRef;
  @ViewChild("myForm") myForm!: Form;
  Descuento: any;
  AplicaDescuento: boolean;
  productos: Iproducto[] = [];
  producto: Iproducto;
  productosAgregados: string[] = [];
  listaProductos: IDetalleVentas[] = [];
  formularioVenta: FormGroup;
  tipopagoSeleccionado: any;
  tipodecuentaSeleccionado: any;
  tipoClienteSeleccionado!: string;
  existeCliente: boolean = false;
  ClienteCredito: boolean = false;
  gastoDeEnvio: IGasto;
  motivosDeEnvio: any;
  userLogged: any;
  TotalComprado: number;
  _totalVentaMaxValue: number = 0;
  codigoVentaCreada: number = 0;
  listadoTiposDeEnvio: ITiposEnvios[] = [];
  isUserAdmin: boolean = false;
  globalConfig: any;

  //Listas de los dropdown
  listaTipoDeCliente: SelectItem[] = [
    {
      label: "Mayorista",
      value: "MAYORISTA"
    },
    {
      label: "Al Detal",
      value: "AL DETAL"
    }
  ];
  listaTipoDeCuenta: SelectItem[] = [
    {
      label: "Ahorros Bancolombia",
      value: 1,
    },
    {
      label: "Nequi",
      value: 2,
    }
  ];
  listaTipoDeEnvio: SelectItem[] = [
    {
      label: "Gratis",
      value: TiposDeEnvioEnum.EnvioGratis
    },
    {
      label: "Envio Local",
      value: TiposDeEnvioEnum.EnvioLocal
    },
    {
      label: "Envio Nacional",
      value: TiposDeEnvioEnum.EnvioNacional
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private invetarioService: InventarioService,
    private clientesService: ClientesService,
    private ventasService: VentasService,
    private alertasService: AlertasService,
    private gastosService: GastosService,
    private tipoEnviosService: TiposEnviosService,
    private dialogService: DialogService) {
    this.userLogged = JSON.parse(localStorage.getItem('user') || "");
    this.isUserAdmin = (this.userLogged.USU_NOMBREROL.toLowerCase() === 'admin' ||
      this.userLogged.USU_NOMBREROL.toLowerCase() === 'administrador' ||
      this.userLogged.USU_NOMBREROL.toLowerCase() === 'administrator' ||
      this.userLogged.USU_NOMBREROL.toLowerCase() === 'supervisor');

    this.formularioVenta = formBuilder.group({
      VEN_FECHAVENTA: [{ value: new Date(), disabled: true }, Validators.required],
      VEN_TIPOENVIO: [null, Validators.required],
      VEN_CUENTADESTINO: [null, Validators.required],
      VEN_OBSERVACIONES: [null],
      CLI_ID: [null],
      CLI_NOMBRE: [null, Validators.required],
      CLI_DIRECCION: [null, Validators.required],
      CLI_UBICACION: [null, Validators.required],
      CLI_TIPOCLIENTE: [null, Validators.required],
      CLI_TELEFONO: [null],
      CLI_CORREO: [null],
      PRO_CODIGO: [null],
      PRO_NOMBRE: [{ value: '', disabled: true }],
      VENT_CEDULA: [null],
      PRO_PRECIO: [{ value: 0, disabled: !this.isUserAdmin }, Validators.min(0)],
      PRO_CANTIDADVENTA: [null, Validators.min(0)],
      PRO_VALORTOTAL: [{ value: 0, disabled: !this.isUserAdmin }, Validators.min(0)],
      PRO_DESCUENTO: [{ value: 0, disabled: !this.isUserAdmin }, Validators.min(0)],
    });
    this.producto = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      PRO_MARCA: '',
      PRO_CATEGORIA: '',
      PRO_PRECIO_COMPRA: 0,
      PRO_PRECIOVENTA_DETAL: 0,
      PRO_PRECIOVENTA_MAYORISTA: 0,
      PRO_UNIDADES_DISPONIBLES: 0,
      PRO_UNIDADES_MINIMAS_ALERTA: 0,
      PRO_ACTUALIZACION: new Date(),
      PRO_FECHACREACION: new Date(),
      PRO_ESTADO: false,
      COM_CANTIDAD: 0,
      PRO_REGALO: false
    };
    this.gastoDeEnvio = {
      GAS_CODIGO: 0,
      GAS_FECHACREACION: new Date(),
      GAS_FECHAGASTO: new Date(),
      MOG_CODIGO: 0,
      GAS_VALOR: 0,
      TIC_CODIGO: 0,
      GAS_ESTADO: false,
      USU_CEDULA: this.userLogged.USU_CEDULA,
      GAS_PENDIENTE: false,
      VEN_CODIGO: 0,
      GAS_OBSERVACIONES: ''
    }
    this.TotalComprado = 0;
    this.AplicaDescuento = false;

    // obtenemos la configuracion de autocompletar la cuenta de envio.
    this.ventasService.getConfig().subscribe((result: any) => {
      this.globalConfig = result;
    });
  }
  ngOnInit(): void {
    this.ObtenerTipoCuentas();
    this.ObtenerTipoDeGastoEnvio();
    this.LlenadoProductos();
    this.ObtenerDescuento();
  }
  ObtenerDescuento() {
    this.ventasService.getConfig().subscribe(config => {
      console.log("Descuento: " + config.Descuento)
      this.Descuento = config.Descuento;
    })
  }
  ObtenerTipoCuentas() {
    this.ventasService.BuscarTipoCuentas().subscribe((result: any) => {
      if (result === null) {
        this.alertasService.SetToast("No hay Cuentas asignadas.", 3);
        return;
      }
      this.listaTipoDeCuenta = result.map((item: any) => {
        const selectItem: SelectItem = {
          label: item.TIC_NOMBRE,
          value: item.TIC_CODIGO,
          title: item.TIC_ESTIPOENVIO.toString()
        }
        return selectItem;
      });
    });
  }

  ObtenerTipoDeGastoEnvio() {
    this.tipoEnviosService.ObtenerTipoEnvios().subscribe((result: any) => {
      if (result === null) {
        this.alertasService.SetToast("No hay Motivos de envio.", 3);
        return;
      }
      this.listadoTiposDeEnvio = result;
      this.listaTipoDeEnvio = result.map((item: any) => {
        const selectItem: SelectItem = {
          label: item.TIP_NOMBRE,
          value: item.TIP_CODIGO
        }
        return selectItem;
      });
    });
  }

  AutocompletarCedula() {
    this.listaProductos = [];
    this.CalcularTotalComprado();
    this.clientesService.BuscarClienteID(this.formularioVenta.controls['VENT_CEDULA'].value)
      .subscribe((result: Icliente) => {
        if (!result || result === null) {
          this.existeCliente = false;
          this.formularioVenta.controls['CLI_NOMBRE'].setValue('');
          this.formularioVenta.controls['CLI_DIRECCION'].setValue('');
          this.formularioVenta.controls['CLI_UBICACION'].setValue('');
          this.formularioVenta.controls['CLI_TELEFONO'].setValue('');
          this.formularioVenta.controls['CLI_CORREO'].setValue('');
          this.alertasService.SetToast("El cliente no existe. Por favor diligencie los datos para crearlo.", 2);
          this.ClienteCredito = false;

          // Deshabilitar CLI_TIPOCLIENTE solo si el usuario no es administrador
          if (!this.isUserAdmin) {
            this.formularioVenta.controls['CLI_TIPOCLIENTE'].enable();
          }

          return;
        }

        this.existeCliente = true;
        this.formularioVenta.controls['CLI_NOMBRE'].setValue(result.CLI_NOMBRE);
        this.formularioVenta.controls['CLI_DIRECCION'].setValue(result.CLI_DIRECCION);
        this.formularioVenta.controls['CLI_UBICACION'].setValue(result.CLI_UBICACION);
        this.formularioVenta.controls['CLI_TELEFONO'].setValue(result.CLI_TELEFONO);
        this.formularioVenta.controls['CLI_CORREO'].setValue(result.CLI_CORREO);
        this.ClienteCredito = result.CLI_ESCREDITO == null ? false : result.CLI_ESCREDITO;

        const tipoClienteControl = this.formularioVenta.controls['CLI_TIPOCLIENTE'];
        const tipoCliente = this.listaTipoDeCliente.filter((tipocliente: SelectItem) => {
          return tipocliente.value == result.CLI_TIPOCLIENTE;
        });

        this.formularioVenta.controls['CLI_TIPOCLIENTE'].setValue((tipoCliente.length > 0) ? tipoCliente[0].value : null);

        // Deshabilitar CLI_TIPOCLIENTE solo si el usuario no es administrador
        if (!this.isUserAdmin) {
          tipoClienteControl.disable();
        }

        this.tipoDeEnvioDropdown.focus();
        this.alertasService.SetToast("Cliente encontrado.", 1);
      });
  }
  AutocompletarProducto() {
    if (!this.formularioVenta.controls['CLI_TIPOCLIENTE'].value || this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === null) {
      this.alertasService.SetToast("Debe seleccionar un tipo de cliente.", 2);
      return;
    }
    if (!this.formularioVenta.controls['VEN_TIPOENVIO'].value || this.formularioVenta.controls['VEN_TIPOENVIO'].value === null) {
      this.alertasService.SetToast("Debe seleccionar un tipo de envio.", 2);
      return;
    }
    let valorTotal;

    this.formularioVenta.controls['PRO_NOMBRE'].setValue(this.producto.PRO_NOMBRE);
    this.formularioVenta.controls['PRO_PRECIO'].valueChanges.subscribe((newValue) => {
      // Llama a la función para calcular el valor total cuando cambie el precio
      this.CalcularValorTotal(null);

    });
    // Verificar si el producto es un regalo
    const esProductoRegalo: boolean = this.producto?.PRO_REGALO ?? false;

    if (esProductoRegalo) {
      // Habilitar los campos directamente para productos regalo
      this.formularioVenta.controls['PRO_PRECIO'].enable();
      this.formularioVenta.controls['PRO_VALORTOTAL'].disable();
      this.formularioVenta.controls['PRO_DESCUENTO'].disable();
    } else {
      // Deshabilitar los campos si no es regalo
      if (!this.isUserAdmin) {
        this.formularioVenta.controls['PRO_PRECIO'].disable();
        this.formularioVenta.controls['PRO_VALORTOTAL'].disable();
        this.formularioVenta.controls['PRO_DESCUENTO'].disable();
      } else {
        this.formularioVenta.controls['PRO_PRECIO'].enable();
        this.formularioVenta.controls['PRO_VALORTOTAL'].enable();
        this.formularioVenta.controls['PRO_DESCUENTO'].enable();
      }

    }

    if (this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[0].value) {
      valorTotal = this.producto.PRO_PRECIOVENTA_MAYORISTA;
      this.formularioVenta.controls['PRO_PRECIO'].setValue(valorTotal);
    }

    if (this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[1].value) {
      if (!esProductoRegalo && this.AplicaDescuento) {
        valorTotal = (this.producto.PRO_PRECIOVENTA_DETAL - this.Descuento);
        if (valorTotal < 0) {
          valorTotal = 0;
        }
      } else {
        valorTotal = this.producto.PRO_PRECIOVENTA_DETAL;
      }
      this.formularioVenta.controls['PRO_PRECIO'].setValue(valorTotal);
    }

    this.formularioVenta.controls['PRO_CANTIDADVENTA'].setValue(1);
    this.formularioVenta.controls['PRO_VALORTOTAL'].setValue(valorTotal);
    this._totalVentaMaxValue = valorTotal ?? Number.MAX_VALUE;
  }

  CalcularDescuentoPorcentajePrecioUnitario(event: any) {
    if (!this.formularioVenta.controls['PRO_PRECIO'].value || this.formularioVenta.controls['PRO_PRECIO'].value == '') {
      this.alertasService.SetToast("El producto no tiene precio por unidad.", 3);
      this.formularioVenta.controls['PRO_DESCUENTO'].setValue(0);
      return;
    }
    if (this.formularioVenta.controls['PRO_DESCUENTO'].value > 100 || this.formularioVenta.controls['PRO_DESCUENTO'].value < 0) {
      this.formularioVenta.controls['PRO_DESCUENTO'].setValue(0);
    }
    let porcentajeDescuento = 0;
    let valorNetoUnitario = 0;
    if (this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[0].value) {
      valorNetoUnitario = this.producto.PRO_PRECIOVENTA_MAYORISTA;
    }

    if (this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[1].value) {
      valorNetoUnitario = this.producto.PRO_PRECIOVENTA_DETAL;
    }

    try {
      porcentajeDescuento = (1 - this.formularioVenta.controls['PRO_PRECIO'].value / valorNetoUnitario) * 100;
    } catch (error) {
      this.alertasService.SetToast("Error calculando el valor total.", 3);
      return;
    }
    this.formularioVenta.controls['PRO_DESCUENTO'].setValue(porcentajeDescuento);
  }

  CalcularValorTotal(event: any) {
    if (!this.formularioVenta.controls['PRO_PRECIO'].value || this.formularioVenta.controls['PRO_PRECIO'].value == '') {
      // this.alertasService.SetToast("El producto no tiene precio por unidad.", 3);
      // return;
    }
    if (this.formularioVenta.controls['PRO_CANTIDADVENTA'].value > (this.producto.PRO_UNIDADES_DISPONIBLES ?? 0)) {
      this.alertasService.SetToast("Esta Excediendo la cantidad disponible de producto.", 2, 2500);
      this.formularioVenta.controls['PRO_CANTIDADVENTA'].setValue((this.producto.PRO_UNIDADES_DISPONIBLES ?? 0));
    }

    let totalVenta = 0;
    const valorNeto = (this.formularioVenta.controls['PRO_CANTIDADVENTA'].value * this.formularioVenta.controls['PRO_PRECIO'].value);
    try {
      totalVenta = valorNeto
    } catch (error) {
      this.alertasService.SetToast("Error calculando el valor total.", 3);
      return;
    }
    this.formularioVenta.controls['PRO_VALORTOTAL'].setValue(totalVenta);
  }
  CalcularValorTotalConDescuento(event: any) {
    if (!this.formularioVenta.controls['PRO_PRECIO'].value || this.formularioVenta.controls['PRO_PRECIO'].value == '') {
      this.alertasService.SetToast("El producto no tiene precio por unidad.", 3);
      this.formularioVenta.controls['PRO_DESCUENTO'].setValue(0);
      return;
    }
    if (this.formularioVenta.controls['PRO_DESCUENTO'].value > 100 || this.formularioVenta.controls['PRO_DESCUENTO'].value < 0) {
      this.formularioVenta.controls['PRO_DESCUENTO'].setValue(0);
    }
    let totalVenta = 0;
    const valorNeto = (this.formularioVenta.controls['PRO_CANTIDADVENTA'].value * this.formularioVenta.controls['PRO_PRECIO'].value);

    try {
      totalVenta = valorNeto * ((100 - this.formularioVenta.controls['PRO_DESCUENTO'].value) / 100);
    } catch (error) {
      this.alertasService.SetToast("Error calculando el valor total.", 3);
      return;
    }
    this.formularioVenta.controls['PRO_VALORTOTAL'].setValue(totalVenta);
  }

  CalcularDescuentoPorcentaje(event: any) {
    if (!this.formularioVenta.controls['PRO_PRECIO'].value || this.formularioVenta.controls['PRO_PRECIO'].value == '') {
      this.alertasService.SetToast("El producto no tiene precio por unidad.", 3);
      return;
    }
    let totalDescuento = 0;
    const valorNeto = (this.formularioVenta.controls['PRO_CANTIDADVENTA'].value * this.formularioVenta.controls['PRO_PRECIO'].value);
    try {
      totalDescuento = (1 - (this.formularioVenta.controls['PRO_VALORTOTAL'].value / valorNeto)) * 100;
    } catch (error) {
      this.alertasService.SetToast("Error calculando el valor total.", 3);
      return;
    }
    if (totalDescuento < 0)
      return;
    this.formularioVenta.controls['PRO_DESCUENTO'].setValue(totalDescuento.toFixed(1));
  }
  AgregarProducto(event: any) {
    if (!this.producto || !this.producto.PRO_CODIGO) {
      this.alertasService.SetToast("Seleccione un producto.", 2);
      return;
    }

    const cantidadVenta = this.formularioVenta.controls['PRO_CANTIDADVENTA'].value;
    const precioVenta = this.formularioVenta.controls['PRO_PRECIO'].value;

    // Add validation checks for empty or non-numeric fields
    if (
      cantidadVenta == null || cantidadVenta <= 0 ||
      precioVenta == null || precioVenta === '' || isNaN(precioVenta) || precioVenta < 0
    ) {
      this.alertasService.SetToast("La cantidad debe ser mayor a 0 y el precio debe ser un valor numérico mayor o igual a 0.", 2);
      return;
    }
    const codigoProducto = this.producto.PRO_CODIGO;

    // Verificar si el producto ya ha sido agregado
    const productoExistente = this.listaProductos.find(producto => producto.PRO_CODIGO?.toUpperCase() === codigoProducto.toUpperCase());
    if (productoExistente) {
      this.alertasService.SetToast("Este producto ya ha sido agregado.", 2);
      return;
    }

    if (cantidadVenta > (this.producto.PRO_UNIDADES_DISPONIBLES ?? 0)) {
      this.alertasService.SetToast("No hay suficientes unidades disponibles del producto.", 3);
      return;
    }

    let descuento = this.formularioVenta.controls['PRO_DESCUENTO'].value || 0;
    if (descuento == "" || descuento == null) {
      descuento = 0;
    }
    if (descuento < 0) {
      this.alertasService.SetToast("El descuento no puede ser negativo.", 3);
      return;
    }

    const total = this.formularioVenta.controls['PRO_VALORTOTAL'].value || 0;

    if (isNaN(total) || total < 0) {
      this.alertasService.SetToast("El valor total debe ser un valor numérico mayor o igual a 0.", 3);
      return;
    }

    const detalleVenta: IDetalleVentas = {
      VED_CODIGO: 0,
      VEN_CODIGO: 0,
      PRO_CODIGO: this.producto.PRO_CODIGO,
      PRO_NOMBRE: this.producto.PRO_NOMBRE,
      VED_UNIDADES: cantidadVenta,
      VED_PRECIOVENTA_UND: precioVenta,
      VED_VALORDESCUENTO_UND: descuento,
      VED_PRECIOVENTA_TOTAL: total,
      VED_ACTUALIZACION: new Date(),
      VED_ESTADO: true,
    };

    this.producto = {
      PRO_CODIGO: '',
      PRO_NOMBRE: '',
      PRO_MARCA: '',
      PRO_CATEGORIA: '',
      PRO_PRECIO_COMPRA: 0,
      PRO_PRECIOVENTA_DETAL: 0,
      PRO_PRECIOVENTA_MAYORISTA: 0,
      PRO_UNIDADES_DISPONIBLES: 0,
      PRO_UNIDADES_MINIMAS_ALERTA: 0,
      PRO_ACTUALIZACION: new Date(),
      PRO_FECHACREACION: new Date(),
      PRO_ESTADO: false,
      COM_CANTIDAD: 0,
      PRO_REGALO: false
    };
    this.formularioVenta.controls['PRO_NOMBRE'].setValue('');
    this.formularioVenta.controls['PRO_CANTIDADVENTA'].setValue('');
    this.formularioVenta.controls['PRO_PRECIO'].setValue('');
    this.formularioVenta.controls['PRO_VALORTOTAL'].setValue('');
    this.formularioVenta.controls['PRO_DESCUENTO'].setValue('');

    this.formularioVenta.controls['PRO_CODIGO'].clearValidators();
    this.formularioVenta.controls['PRO_CANTIDADVENTA'].clearValidators();
    this.formularioVenta.controls['PRO_DESCUENTO'].clearValidators();

    this.listaProductos.push(detalleVenta); // Agregamos el producto a la lista
    this.alertasService.SetToast("Producto agregado con éxito.", 1);
    this.CalcularTotalComprado();
  }
  eliminarVenta(venta: IDetalleVentas) {
    if (venta.PRO_CODIGO === '9999' || venta.PRO_NOMBRE === 'ENVIO') {
      this.alertasService.SetToast("No puedes eliminar este producto.", 2);
      return;
    }

    const index = this.listaProductos.indexOf(venta);
    if (index !== -1) {
      this.listaProductos.splice(index, 1);
      this.alertasService.SetToast("Producto eliminado.", 1);
    }
    this.CalcularTotalComprado();
  }
  AgregarTipoDeEnvio(event: any) {
    ;
    const tipoEnvio: ITiposEnvios = this.listadoTiposDeEnvio.filter((tipoEnvio: ITiposEnvios) => {
      return tipoEnvio.TIP_CODIGO == this.formularioVenta.controls['VEN_TIPOENVIO'].value;
    })[0];

    if (!this.formularioVenta.controls['CLI_UBICACION'].value || this.formularioVenta.controls['CLI_UBICACION'].value === '') {
      this.alertasService.SetToast("Por Favor ingrese la ubicacion.", 2);
      this.formularioVenta.controls['VEN_TIPOENVIO'].setValue('')
      return;
    }
    if (!this.formularioVenta.controls['CLI_TIPOCLIENTE'].value || this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === '') {
      this.alertasService.SetToast("Debe seleccionar un tipo de cliente.", 2);
      this.formularioVenta.controls['VEN_TIPOENVIO'].setValue('')
      return;
    }
    if (!tipoEnvio) {
      this.alertasService.SetToast("Por Favor seleccione un tipo de envio.", 2);
      this.formularioVenta.controls['VEN_TIPOENVIO'].setValue('')
      return;
    }
    // variables condicionales 
    const estaFueraDeBuga = (this.formularioVenta.controls['CLI_UBICACION'].value + '').toUpperCase().indexOf('BUGA') < 0;
    const esClienteDetal = this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[1].value // cliente detal 
    // creamos el gasto
    this.gastoDeEnvio = {
      GAS_CODIGO: 0,
      GAS_FECHACREACION: new Date(),
      GAS_FECHAGASTO: new Date(),
      MOG_CODIGO: tipoEnvio.TIP_CODIGO,
      GAS_VALOR: tipoEnvio.TIP_VALOR,
      TIC_CODIGO: this.formularioVenta.controls['VEN_CUENTADESTINO'].value,
      GAS_ESTADO: true,
      USU_CEDULA: this.userLogged.USU_CEDULA,
      GAS_PENDIENTE: true,
      VEN_CODIGO: 0,
      GAS_OBSERVACIONES: "",
    }
    this.AgreagarEnvioAProductos(esClienteDetal, estaFueraDeBuga, this.gastoDeEnvio.GAS_VALOR);
    if (esClienteDetal && !estaFueraDeBuga) {
      this.AplicaDescuento = true;
    } else {
      this.AplicaDescuento = false;
    }
    this.CalcularTotalComprado();
  }
  ValidacionCantidadRegalos(Carrito: IDetalleVentas[], cliente: string): boolean {
    debugger;
    let RegalosDemas = false
    let Regalos = Carrito.filter(x => x.VED_PRECIOVENTA_UND == 0 && x.PRO_CODIGO != "9999");
    let NoRegalos = Carrito.filter(x => x.VED_PRECIOVENTA_UND != 0 && x.PRO_CODIGO != "9999");

    let totalProductosNoRegalos = NoRegalos.reduce((anterior, actual) => {
      return anterior + parseInt(actual.VED_UNIDADES);
    }, 0)
    let contador = totalProductosNoRegalos;
    if (cliente == "MAYORISTA") {
      contador = Math.round(totalProductosNoRegalos / 4);
    }
    for (let i = 0; i < Regalos.length; i++) {
      let regalo = Regalos[i];
      let producto = this.productos.find(x => x.PRO_CODIGO == regalo.PRO_CODIGO)
      let numerador = parseInt(regalo.VED_UNIDADES);
      let denominador = producto?.PRO_UNIDADREGALO == undefined ? 1 : producto?.PRO_UNIDADREGALO;
      let multiplicador = producto?.PRO_UNIDAD_MINIMAREGALO == undefined ? 1 : producto?.PRO_UNIDAD_MINIMAREGALO;
      let CantidadRegaloPorProducto = Math.round(numerador / denominador) * multiplicador;
      contador = contador - CantidadRegaloPorProducto;
      if (contador < 0) {
        RegalosDemas = true;
        break;
      }
    }
    return RegalosDemas;

  }
  FinalizarFactura(event?: any) {
    for (const control in this.formularioVenta.controls) {
      if (this.formularioVenta.controls[control].invalid) {
        this.alertasService.SetToast(`El campo ${control.split('_')[1]} está incompleto`, 2);
        this.formularioVenta.controls[control].markAsDirty();
        return;

      }
    }
    const hasProducts = this.listaProductos.some(product => product.PRO_NOMBRE !== 'ENVIO' && 'envio');
    if (!hasProducts && this.listaProductos.length === 1) {
      this.alertasService.SetToast('Debe agregar al menos un producto diferente al ENVIO.', 2);
      return;
    }
    if (this.listaProductos.length == 0) {
      this.alertasService.SetToast('Debe agregar al menos un producto.', 2);
      return;
    }
    if (!this.formularioVenta.controls['VEN_CUENTADESTINO'].value || this.formularioVenta.controls['VEN_CUENTADESTINO'].value === null) {
      // Agregar mensaje de error
      // this.alertasService.SetToast("Debe ingresar el una cuenta destino.", 3);
      return;
    }
    //obtenemos los datos sobre el tipo de venta
    const nombreTipoCuenta = this.listaTipoDeCuenta.filter((tipocliente: any) => {
      return tipocliente.value == this.formularioVenta.controls['VEN_CUENTADESTINO'].value;
    });

    const valorTotalVenta: number = this.listaProductos.reduce((acumulador, actual) => acumulador + actual.VED_PRECIOVENTA_TOTAL, 0) + 0;
    const esVentaACredito: boolean = (nombreTipoCuenta[0].label && nombreTipoCuenta[0].label.toLowerCase().indexOf('credito') >= 0 ? true : false);
    const esVentaAEfectivo: boolean = (nombreTipoCuenta[0].label && nombreTipoCuenta[0].label.toLowerCase().indexOf('efectivo') >= 0 ? true : false);

    if (!this.existeCliente) { //validamos que el cliente exista, en caso que no lo creamos 
      const cliente: Icliente = {
        ClI_ID: this.formularioVenta.controls['VENT_CEDULA'].value,
        CLI_NOMBRE: this.formularioVenta.controls['CLI_NOMBRE'].value,
        CLI_TIPOCLIENTE: this.formularioVenta.controls['CLI_TIPOCLIENTE'].value,
        CLI_UBICACION: this.formularioVenta.controls['CLI_UBICACION'].value,
        CLI_DIRECCION: this.formularioVenta.controls['CLI_DIRECCION'].value,
        CLI_CORREO: this.formularioVenta.controls['CLI_CORREO'].value,
        CLI_TELEFONO: this.formularioVenta.controls['CLI_TELEFONO'].value == "" ? null : this.formularioVenta.controls['CLI_TELEFONO'].value,
        CLI_FECHACREACION: new Date(),
        CLI_ESTADO: true,
        CLI_ESCREDITO: esVentaACredito,
      };

      this.clientesService.CrearCliente(cliente).subscribe((result: any) => {
        this.alertasService.SetToast("Cliente creado exitosamente.", 1);
      })
    }
    else {
      //logica para validar si es el pago es a credito y no se esta cobrando el envio se agrega al listado de productos para que afecte el total de lo vendido
      ;
      if (esVentaACredito && this.listaProductos.findIndex(x => x.PRO_CODIGO == "9999") == -1) {
        let producto: IDetalleVentas = {
          VED_CODIGO: 0,
          VEN_CODIGO: 0,
          PRO_CODIGO: '9999',
          PRO_NOMBRE: 'ENVIO',
          VED_UNIDADES: '1',
          VED_PRECIOVENTA_UND: this.gastoDeEnvio.GAS_VALOR,
          VED_VALORDESCUENTO_UND: 0,
          VED_PRECIOVENTA_TOTAL: this.gastoDeEnvio.GAS_VALOR,
          VED_ACTUALIZACION: new Date(),
          VED_ESTADO: false
        }
        this.listaProductos.unshift(producto);
        this.CalcularTotalComprado();
      }
      const cliente: Icliente = {
        ClI_ID: this.formularioVenta.controls['VENT_CEDULA'].value,
        CLI_NOMBRE: this.formularioVenta.controls['CLI_NOMBRE'].value,
        CLI_TIPOCLIENTE: this.formularioVenta.controls['CLI_TIPOCLIENTE'].value,
        CLI_UBICACION: this.formularioVenta.controls['CLI_UBICACION'].value,
        CLI_DIRECCION: this.formularioVenta.controls['CLI_DIRECCION'].value,
        CLI_CORREO: this.formularioVenta.controls['CLI_CORREO'].value,
        CLI_TELEFONO: this.formularioVenta.controls['CLI_TELEFONO'].value == "" ? null : this.formularioVenta.controls['CLI_TELEFONO'].value,
        CLI_FECHACREACION: new Date(),
        CLI_ESTADO: true,
        CLI_ESCREDITO: esVentaACredito == true ? esVentaACredito : this.ClienteCredito,
      };
      this.clientesService.ActualizarCliente(cliente.ClI_ID, cliente).subscribe((result: any) => {
        this.alertasService.SetToast("Cliente Actualizado exitosamente.", 1);
      })
    }
    if (this.listaProductos.filter(x => x.VED_PRECIOVENTA_UND == 0).length == 0) {
      this.alertasService.confirmacion("No ha agregado ningun regalo, ¿Esta seguro de continuar?").then(
        (resolve: any) => {
          if (resolve) {
            this.ConstruirVenta(nombreTipoCuenta, esVentaACredito)
          } else {
            return
          }
        })
    } else {
      this.ConstruirVenta(nombreTipoCuenta, esVentaACredito)
    }

    this.formularioVenta.controls['PRO_PRECIO'].disable();
    this.formularioVenta.controls['PRO_VALORTOTAL'].disable();
    this.formularioVenta.controls['PRO_DESCUENTO'].disable();
  }
  ConstruirVenta(nombreTipoCuenta: any, esVentaACredito: boolean) {
    const venta: Iventa = {
      VEN_CODIGO: 0,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: this.formularioVenta.controls['VEN_FECHAVENTA'].value,
      VEN_TIPOPAGO: nombreTipoCuenta[0].label,
      TIC_CODIGO: nombreTipoCuenta[0].value,
      TIC_NOMBRE: nombreTipoCuenta[0].label,
      CLI_ID: this.formularioVenta.controls['VENT_CEDULA'].value,
      CLI_NOMBRE: this.formularioVenta.controls['CLI_NOMBRE'].value,
      CLI_DIRECCION: this.formularioVenta.controls['CLI_DIRECCION'].value,
      CLI_TELEFONO: this.formularioVenta.controls['CLI_TELEFONO'].value == "" ? null : this.formularioVenta.controls['CLI_TELEFONO'].value,
      CLI_UBICACION: this.formularioVenta.controls['CLI_UBICACION'].value,
      CLI_TIPOCLIENTE: this.formularioVenta.controls['CLI_TIPOCLIENTE'].value,
      VEN_PRECIOTOTAL: this.TotalComprado,
      VEN_ESTADOCREDITO: esVentaACredito,
      VEN_ENVIO: false,
      VEN_DOMICILIO: false,
      VEN_OBSERVACIONES: this.formularioVenta.controls['VEN_OBSERVACIONES'].value,
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: this.userLogged.USU_CEDULA,
      VEN_ESTADOVENTA: esVentaACredito,
      VEN_ESTADO: true,
      TIP_CODIGO: this.formularioVenta.controls['VEN_TIPOENVIO'].value,
      DetalleVentas: this.listaProductos,
      VEN_TIENE_REGALOSDEMAS: false
    }
    if (venta.VEN_OBSERVACIONES == null || venta.VEN_OBSERVACIONES == undefined) {
      venta.VEN_OBSERVACIONES = "";
    }
    if (this.ValidacionCantidadRegalos(this.listaProductos, this.formularioVenta.controls['CLI_TIPOCLIENTE'].value)) {
      venta.VEN_TIENE_REGALOSDEMAS = true;
      this.alertasService.confirmacion("Esta registrando regalos demas, ¿Esta seguro de continuar?").then(
        (resolve: any) => {
          if (resolve) {
            this.CrearVenta(venta);
          } else {
            return;
          }
        })
    } else {
      this.CrearVenta(venta);
    }

  }
  CrearVenta(venta: Iventa) {
    this.alertasService.showLoading("Creando venta")
    this.ventasService.CrearVenta(venta).subscribe((result: any) => {
      this.alertasService.hideLoading();
      if (result.StatusCode.toString().indexOf('20') >= 0) {
        //Lipiamos el formulario y enviamos mensaje de que esta correcto.
        this.alertasService.SetToast("Venta creada exitosamente.", 1);
        this.listaProductos = [];
        this.codigoVentaCreada = result.Data;
        // Validamos si el envio no fue gratis y realizamos la crecion del gasto
        if (this.listaTipoDeEnvio.find(x => x.value == this.formularioVenta.controls['VEN_TIPOENVIO'].value)?.label?.toUpperCase() != "GRATIS") {
          this.gastoDeEnvio.VEN_CODIGO = result.Data;
          this.AbrirModalTipoCuentasGastos();
        }
        this.formularioVenta.reset();
        this.formularioVenta.controls['VEN_FECHAVENTA'].setValue(new Date())
        this.TotalComprado = 0;
        this.AplicaDescuento = false;
      }
    }, err => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast(err, 1);
    });
  }
  ImprirFaturaCompra() {
    this.alertasService.confirmacion("Desea visualizar la factura de venta # " + this.codigoVentaCreada).then(
      (resolve: any) => {
        if (resolve) {
          this.BuscarVentaPorCodigo();
        }
      })
  }
  AbrirModalTipoCuentasGastos() {
    debugger;
    let autocompletarCuentaEnvio: boolean = false;
    let asignacionCuentaseEnvio: any;

    // obtenemos la configuracion de autocompletar la cuenta de envio.
    autocompletarCuentaEnvio = this.globalConfig.AutocompletarCuentaEnvio ?? false;
    asignacionCuentaseEnvio = this.globalConfig.AsignacionAutomaticaDeCuentaDeEnvio ?? undefined;
    if (!asignacionCuentaseEnvio) // en caso que no haya una asignacion de cuenta valida.
      autocompletarCuentaEnvio = false;

    const _tipoEnvio: string = this.listaTipoDeEnvio.find(x => x.value == this.formularioVenta.controls['VEN_TIPOENVIO'].value)?.label?.toUpperCase() || ""
    // validamos que haya una realcion dentro de la configuracion
    if (!_tipoEnvio || _tipoEnvio === "") {
      autocompletarCuentaEnvio = false;
    }
    let _cuenta: any = this.listaTipoDeCuenta.filter(x => x.label == (!asignacionCuentaseEnvio[_tipoEnvio] ? "" : asignacionCuentaseEnvio[_tipoEnvio]));
    if(!_cuenta || _cuenta.length <= 0){
      autocompletarCuentaEnvio = false;
    }

    if (!autocompletarCuentaEnvio) {
      debugger;
      let ref = this.dialogService.open(PagoEnvioComponent, {
        header: 'Seleccione el tipo de de pago para el gasto de envio',
        width: '30%',
        baseZIndex: 100,
        maximizable: false,
        dismissableMask: false,
        closeOnEscape: false,
        closable: false,
        contentStyle: { 'background-color': '#eff3f8' },
        data: { Listado: this.listaTipoDeCuenta.filter(x => x.title == "true") }
      })
      ref.onClose.subscribe((res) => {
        this.gastoDeEnvio.TIC_CODIGO = res;
        if (this.listaTipoDeCuenta.find(x => x.value == res)?.label?.toUpperCase() == "EFECTIVO") {
          this.gastoDeEnvio.GAS_PENDIENTE = false;
        }
        this.CrearGatosVenta();
      });
    }
    else {
      this.gastoDeEnvio.TIC_CODIGO = _cuenta[0].value;
      if (this.listaTipoDeCuenta.find(x => x.value == _cuenta[0].value)?.label?.toUpperCase() == "EFECTIVO") {
        this.gastoDeEnvio.GAS_PENDIENTE = false;
      }
      this.CrearGatosVenta();
    }
  }
  CrearGatosVenta() {
    this.alertasService.showLoading("Creando Gasto")
    this.gastosService.CrearGastoVenta(this.gastoDeEnvio).subscribe((result: any) => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast("Gasto de envio creado exitosamente.", 1);
      // this.ImprirFaturaCompra();
    }, err => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast(err, 1);
    });
  }
  BuscarVentaPorCodigo() {
    this.alertasService.showLoading("Buscando venta")
    this.ventasService.BuscarVentaID(this.codigoVentaCreada).subscribe((result: Iventa) => {
      this.alertasService.hideLoading();
      this.AbrirModaDetalleVentas(result);
    }, err => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast(err, 1);
    });
  }
  AbrirModaDetalleVentas(venta: Iventa) {
    let ref = this.dialogService.open(DetalleVentasComponent, {
      header: 'Venta #' + venta.VEN_CODIGO,
      width: '60%',
      baseZIndex: 100,
      maximizable: true,
      contentStyle: { 'background-color': '#eff3f8' },
      data: { Venta: venta, Impresion: true }
    })
    ref.onClose.subscribe((res) => {
    });
  }
  CalcularTotalComprado() {
    this.TotalComprado = this.listaProductos.reduce((anterior, actual) => {
      return anterior + actual.VED_PRECIOVENTA_TOTAL;
    }, 0)
  }
  LlenadoProductos() {
    this.invetarioService.BuscarProductos().subscribe(x => {
      this.productos = x;
    })
  }
  CambiarPrecioDelProducto(event: Event) {
    if (!this.producto && this.formularioVenta.controls['PRO_PRECIO'].value === '') {
      this.alertasService.SetToast("Debe buscar un producto", 3);
      return;
    }
    let ref = this.dialogService.open(ValidarUsuarioAdminComponent, {
      header: 'Validar Usuario',
      width: '25%',
      contentStyle: { overflow: 'auto', 'background-color': '#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: {}
    });

    ref.onClose.subscribe((res) => {
      if (res) {
        this.formularioVenta.controls['PRO_PRECIO'].enable();
        this.formularioVenta.controls['PRO_VALORTOTAL'].enable();
        this.formularioVenta.controls['PRO_DESCUENTO'].enable();
        this.formularioVenta.controls['CLI_TIPOCLIENTE'].enable();
      } else {
        this.formularioVenta.controls['PRO_PRECIO'].disable();
        this.formularioVenta.controls['PRO_VALORTOTAL'].disable();
        this.formularioVenta.controls['PRO_DESCUENTO'].disable();
        this.formularioVenta.controls['CLI_TIPOCLIENTE'].disable();
      }
    });
  }

  Cotizar() {
    if (this.formularioVenta.controls['VEN_TIPOENVIO'].value == null || this.formularioVenta.controls['VEN_TIPOENVIO'].value == "") {
      this.alertasService.SetToast("Primero debe seleccionar el tipo de envio", 2)
      return;
    }
    if (this.listaProductos.length == 0) {
      this.alertasService.SetToast('Debe agregar almenos un producto.', 2);
      return;
    }
    const cliente: Icliente = {
      ClI_ID: this.formularioVenta.controls['VENT_CEDULA'].value,
      CLI_NOMBRE: this.formularioVenta.controls['CLI_NOMBRE'].value,
      CLI_TIPOCLIENTE: this.formularioVenta.controls['CLI_TIPOCLIENTE'].value,
      CLI_UBICACION: this.formularioVenta.controls['CLI_UBICACION'].value,
      CLI_DIRECCION: this.formularioVenta.controls['CLI_DIRECCION'].value,
      CLI_CORREO: this.formularioVenta.controls['CLI_CORREO'].value,
      CLI_TELEFONO: this.formularioVenta.controls['CLI_TELEFONO'].value,
      CLI_FECHACREACION: new Date(),
      CLI_ESTADO: true,
      CLI_ESCREDITO: true,
    };
    var productos: IDetalleVentas[] = [];
    for (let i = 0; i < this.listaProductos.length; i++) {
      productos.push(this.listaProductos[i])
    }
    let ref = this.dialogService.open(CotizacionComponent, {
      header: 'Cotización',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 100,
      maximizable: true,
      data: { Productos: productos, TipoEnvio: this.formularioVenta.controls['VEN_TIPOENVIO'].value, Cliente: cliente }
    });
  }

  AgreagarEnvioAProductos(esClienteDetal: boolean, estaFueraDeBuga: boolean, costoDelEnvio: number) {
    let producto: IDetalleVentas = {
      VED_CODIGO: 0,
      VEN_CODIGO: 0,
      PRO_CODIGO: '9999',
      PRO_NOMBRE: 'ENVIO',
      VED_UNIDADES: '1',
      VED_PRECIOVENTA_UND: costoDelEnvio,
      VED_VALORDESCUENTO_UND: 0,
      VED_PRECIOVENTA_TOTAL: costoDelEnvio,
      VED_ACTUALIZACION: new Date(),
      VED_ESTADO: false
    }
    // Detal - Buga - domicilio y envío gratis
    if (esClienteDetal) {
      const index = this.listaProductos.findIndex(x => x.PRO_CODIGO === '9999')
      if (index < 0) {
        return;
      }
      this.listaProductos.shift();
      return;
    }
    const index = this.listaProductos.findIndex(x => x.PRO_CODIGO === '9999')
    if (index < 0) {
      this.listaProductos.unshift(producto);
      return;
    }
    this.listaProductos.shift();
    this.listaProductos.unshift(producto);
    return;
  }
}

enum TiposDeEnvioEnum {
  EnvioGratis = "EnvioGratis",
  EnvioLocal = "EnvioLocal",
  EnvioNacional = "EnvioNacional",
}

import { Component, ElementRef, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Icliente } from 'src/app/Interfaces/icliente';
import { IDetalleVentas } from 'src/app/Interfaces/idetalle-ventas';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { Iventa } from 'src/app/Interfaces/iventa';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { ClientesService } from 'src/app/Servicios/clientes.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit {

  @ViewChild("codigoProdcutoInput") codigoProdcutoInput!: ElementRef;
  @ViewChild("cantidadInput") cantidadInput!: ElementRef;

  producto: Iproducto;
  listaProductos: IDetalleVentas[] = [];
  formularioVenta: FormGroup;
  tipopagoSeleccionado: any;
  tipodecuentaSeleccionado: any;
  tipoClienteSeleccionado!: string;
  existeCliente: boolean = false;
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
  listaTipoDePago: SelectItem[] = [
    {
      label: "Contado",
      value: "Contado"
    },
    {
      label: "Consignacio",
      value: "Consignacio"
    },
    {
      label: "Credito",
      value: "Credito"
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private invetarioService: InventarioService,
    private clientesService: ClientesService,
    private ventasService: VentasService,
    private alertasService: AlertasService,
  ) {
    this.formularioVenta = formBuilder.group({
      VEN_FECHAVENTA: [{ value: new Date(), disabled: false }, Validators.required],
      VEN_TIPOPAGO: [null, Validators.required],
      VEN_CUENTADESTINO: [null, Validators.required],
      CLI_ID: [null, Validators.required],
      CLI_NOMBRE: [null, Validators.required],
      CLI_DIRECCION: [null, Validators.required],
      CLI_UBICACION: [null, Validators.required],
      CLI_TIPOCLIENTE: [null, Validators.required],
      PRO_CODIGO: [null, Validators.required],
      PRO_NOMBRE: [{ value: '', disabled: true }, Validators.required],
      VENT_CEDULA: [null, Validators.required],
      PRO_PRECIO: [{ value: '', disabled: true }],
      PRO_CANTIDADVENTA: [null, Validators.required],
      PRO_VALORTOTAL: [null, Validators.required],
      PRO_DESCUENTO: [{ value: '', disabled: false }, Validators.required],
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
    };
  }
  ngOnInit(): void {
    this.ObtenerTipoCuentas();
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
          value: item.TIC_CODIGO
        }
        return selectItem;
      });
    });
  }

  AutocompletarCedula(event: any) {
    if (event.key === 'Enter') {
      this.clientesService.BuscarClienteID(this.formularioVenta.controls['VENT_CEDULA'].value).subscribe((result: Icliente) => {
        if (!result || result === null) { // en caso que llege vacio el cliente
          this.existeCliente = false;
          this.alertasService.SetToast("El cliente no existe. Por favor diligencie los datos para crearlo.", 2);
          return;
        }
        this.existeCliente = true;
        this.formularioVenta.controls['CLI_NOMBRE'].setValue(result.CLI_NOMBRE);
        this.formularioVenta.controls['CLI_DIRECCION'].setValue(result.CLI_DIRECCION);
        this.formularioVenta.controls['CLI_UBICACION'].setValue(result.CLI_UBICACION);
        const tipoCliente = this.listaTipoDeCliente.filter((tipocliente: SelectItem) => {
          return tipocliente.value == result.CLI_TIPOCLIENTE;
        });
        this.formularioVenta.controls['CLI_TIPOCLIENTE'].setValue((tipoCliente.length > 0) ? tipoCliente[0].value : null);
        this.codigoProdcutoInput.nativeElement.focus();
        this.alertasService.SetToast("Cliente encontrado.", 1);
      });
    }
  }

  AutocompletarProducto(event: any) {
    const codigo = this.formularioVenta.controls['PRO_CODIGO'].value
    if (event.key === 'Enter') {
      if (!this.formularioVenta.controls['CLI_TIPOCLIENTE'].value || this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === null) //en caso que no se haya seleccionado un tipo de cliente 
      {
        // Agregar mensaje de error
        this.alertasService.SetToast("Debe seleccionar un tipo de cliente.", 2);
        return;
      }
      this.invetarioService.BuscarProductoID(codigo).subscribe((result: any) => {
        if (!result || result === null) {// en caso que llege vacio el producto
          // Agregar mensaje de error
          this.alertasService.SetToast("producto no encontrado.", 3);
          return;
        }
        this.producto = result;
        this.formularioVenta.controls['PRO_NOMBRE'].setValue(this.producto.PRO_NOMBRE);
        if (this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[0].value) { //mayorista
          this.formularioVenta.controls['PRO_PRECIO'].setValue(this.producto.PRO_PRECIOVENTA_MAYORISTA);
        }
        if (this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === this.listaTipoDeCliente[1].value) { //Al detal
          this.formularioVenta.controls['PRO_PRECIO'].setValue(this.producto.PRO_PRECIOVENTA_DETAL);
        }
        this.cantidadInput.nativeElement.focus();
      });
    }
  }

  CalcularValorTotal(event: any) {
    if (!this.formularioVenta.controls['PRO_PRECIO'].value || this.formularioVenta.controls['PRO_PRECIO'].value == '') {
      this.alertasService.SetToast("El producto no tiene precio por unidad.", 3);
      return;
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
    this.formularioVenta.controls['PRO_DESCUENTO'].setValue(totalDescuento.toFixed(1));
  }

  AgregarProducto(event: any) {
    if (this.formularioVenta.controls['PRO_CANTIDADVENTA'].value > (this.producto.PRO_UNIDADES_DISPONIBLES ?? 0)) { // validacion de cantidad de producto
      // Agregar mensaje de error
      this.alertasService.SetToast("No hay la cantidad necesaria del producto.", 3);
      return;
    }
    if (!this.formularioVenta.controls['PRO_VALORTOTAL'].value || this.formularioVenta.controls['PRO_VALORTOTAL'].value === null) { // validacion valor total
      // Agregar mensaje de error
      this.alertasService.SetToast("El valor total no puede estas vacio.", 3);
      return;
    }
    const detalleVenta: IDetalleVentas = {
      VED_CODIGO: 0,
      VEN_CODIGO: 0,
      PRO_CODIGO: this.producto.PRO_CODIGO,
      PRO_NOMBRE: this.producto.PRO_NOMBRE,
      VED_UNIDADES: this.formularioVenta.controls['PRO_CANTIDADVENTA'].value,
      VED_PRECIOVENTA_UND: this.formularioVenta.controls['PRO_PRECIO'].value,
      VED_VALORDESCUENTO_UND: this.formularioVenta.controls['PRO_DESCUENTO'].value,
      VED_PRECIOVENTA_TOTAL: this.formularioVenta.controls['PRO_VALORTOTAL'].value,
      VED_ACTUALIZACION: new Date(),
      VED_ESTADO: true,
    }
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
    };
    this.formularioVenta.controls['PRO_CODIGO'].setValue('');
    this.formularioVenta.controls['PRO_NOMBRE'].setValue('');
    this.formularioVenta.controls['PRO_CANTIDADVENTA'].setValue('');
    this.formularioVenta.controls['PRO_PRECIO'].setValue('');
    this.formularioVenta.controls['PRO_VALORTOTAL'].setValue('');
    this.formularioVenta.controls['PRO_DESCUENTO'].setValue('');

    this.formularioVenta.controls['PRO_CODIGO'].clearValidators();
    this.formularioVenta.controls['PRO_CANTIDADVENTA'].clearValidators();
    this.formularioVenta.controls['PRO_DESCUENTO'].clearValidators();
    this.codigoProdcutoInput.nativeElement.focus();

    this.listaProductos.push(detalleVenta); // Agregamos el producto a la lista
    console.log(this.listaProductos);
    this.alertasService.SetToast("Producto agregado con exito.", 1);

  }

  FinalizarFactura(form: any) {
    if (!this.formularioVenta.controls['VEN_TIPOPAGO'].value || this.formularioVenta.controls['VEN_TIPOPAGO'].value === null) {
      // Agregar mensaje de error
      // this.alertasService.SetToast("Debe ingresar el tipo de pago.", 3);
      return;
    }
    if (!this.formularioVenta.controls['VEN_CUENTADESTINO'].value || this.formularioVenta.controls['VEN_CUENTADESTINO'].value === null) {
      // Agregar mensaje de error
      // this.alertasService.SetToast("Debe ingresar el una cuenta destino.", 3);
      return;
    }
    if (!this.existeCliente) { //validamos que el cliente exista, en caso que no lo creamos 
      const cliente: Icliente = {
        ClI_ID: this.formularioVenta.controls['VENT_CEDULA'].value,
        CLI_NOMBRE: this.formularioVenta.controls['CLI_NOMBRE'].value,
        CLI_TIPOCLIENTE: this.formularioVenta.controls['CLI_TIPOCLIENTE'].value,
        CLI_UBICACION: this.formularioVenta.controls['CLI_UBICACION'].value,
        CLI_DIRECCION: this.formularioVenta.controls['CLI_DIRECCION'].value,
        CLI_FECHACREACION: new Date(),
        CLI_ESTADO: true
      };

      this.clientesService.CrearCliente(cliente).subscribe((result: any) => {
        this.alertasService.SetToast("Cliente creado exitosamente.", 1);
      })
    }
    const nombreTipoCuenta = this.listaTipoDeCuenta.filter((tipocliente: any) => {
      return tipocliente.value == this.formularioVenta.controls['VEN_CUENTADESTINO'].value;
    });

    const valorTotalVenta: string = this.listaProductos.reduce((acumulador, actual) => acumulador + actual.VED_PRECIOVENTA_TOTAL, 0) + '';
    const venta: Iventa = {
      VEN_CODIGO: 0,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: this.formularioVenta.controls['VEN_FECHAVENTA'].value,
      VEN_TIPOPAGO: this.formularioVenta.controls['VEN_TIPOPAGO'].value,
      TIC_CODIGO: nombreTipoCuenta[0].value,
      TIC_NOMBRE: nombreTipoCuenta[0].label,
      CLI_ID: this.formularioVenta.controls['VENT_CEDULA'].value,
      CLI_NOMBRE: this.formularioVenta.controls['CLI_NOMBRE'].value,
      CLI_DIRECCION: this.formularioVenta.controls['CLI_DIRECCION'].value,
      CLI_TELEFONO: "0",
      CLI_TIPOCLIENTE: this.formularioVenta.controls['CLI_TIPOCLIENTE'].value,
      VEN_PRECIOTOTAL: valorTotalVenta,
      VEN_ESTADOCREDITO: false,
      VEN_ENVIO: false,
      VEN_DOMICILIO: false,
      VEN_OBSERVACIONES: "",
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: "123456",
      VEN_ESTADOVENTA: true,
      VEN_ESTADO: true,
      DetalleVentas: this.listaProductos,
    }
    this.ventasService.CrearVenta(venta).subscribe((result: any) => {
      if (result.statusCode.toString().indexOf('20') >= 0) {
        //Lipiamos el formulario y enviamos mensaje de que esta correcto.
        form.resetForm();
        this.formularioVenta.controls['VEN_FECHAVENTA'].setValue(new Date())
        this.alertasService.SetToast("Venta creada exitosamente.", 1);

      }
    });
  }
}

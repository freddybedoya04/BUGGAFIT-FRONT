import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Icliente } from 'src/app/Interfaces/icliente';
import { Iproducto } from 'src/app/Interfaces/iproducto';
import { ClientesService } from 'src/app/Servicios/clientes.service';
import { InventarioService } from 'src/app/Servicios/inventario.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {
  producto: Iproducto;
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
  listaTipoDeCuenta: any[] = [
    {
      label: "Ahorros Bancolombia",
      value: "AhorrosBancolombia",
      numeroDeCuenta: "123456789"
    },
    {
      label: "Nequi",
      value: "Nequi",
      numeroDeCuenta: "3164898986"
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
  ) {
    this.formularioVenta = formBuilder.group({
      VEN_FECHAVENTA: [{value: new Date(), disabled: false}, Validators.required],
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

  AutocompletarCedula(event: any) {
    if (event.key === 'Enter') {
      console.log(this.formularioVenta.controls['VENT_CEDULA'].value);
      this.clientesService.BuscarClienteID(this.formularioVenta.controls['VENT_CEDULA'].value).subscribe((result: Icliente) => {
        if (!result || result === null) { // en caso que llege vacio el cliente
          this.existeCliente = false;
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
      });
    }
  }

  AutocompletarProducto(event: any) {
    const codigo = this.formularioVenta.controls['PRO_CODIGO'].value
    if (event.key === 'Enter') {
      if (!this.formularioVenta.controls['CLI_TIPOCLIENTE'].value || this.formularioVenta.controls['CLI_TIPOCLIENTE'].value === null) //en caso que no se haya seleccionado un tipo de cliente 
        return;
      console.log(codigo);
      this.invetarioService.BuscarProductoID(codigo).subscribe((result: any) => {
        if (!result || result === null) {// en caso que llege vacio el producto
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
      });
    }
  }
}

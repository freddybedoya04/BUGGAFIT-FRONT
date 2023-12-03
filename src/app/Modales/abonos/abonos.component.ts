import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Iabonos } from 'src/app/Interfaces/iabonos';
import { Icredito } from 'src/app/Interfaces/icredito';
import { Iventa } from 'src/app/Interfaces/iventa';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { CreditosService } from 'src/app/Servicios/credito.service';
import { VentasService } from 'src/app/Servicios/ventas.service';

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.scss']
})
export class AbonosComponent implements OnInit {

  venta: Iventa;
  abonos: Iabonos[] = [];
  nuevoAbono: Iabonos;
  saldo: number = 0;
  totalAbonado: number = 0;
  listaTipoDeCuenta: SelectItem[] = [];
  CuentaSeleccionada: SelectItem;
  esEditar: boolean = false;
  credito: Icredito;
  userLogged: any;
  constructor(private ventasService: VentasService, private alertasService: AlertasService,
    private config: DynamicDialogConfig, public ref: DynamicDialogRef,
    private creditoService: CreditosService) {
    this.userLogged = JSON.parse(localStorage.getItem('user') || "");
    this.venta = {
      VEN_CODIGO: 0,
      VEN_FECHACREACION: new Date(),
      VEN_FECHAVENTA: new Date(),
      VEN_TIPOPAGO: '',
      TIC_CODIGO: 0,
      TIC_NOMBRE: '',
      CLI_ID: 0,
      CLI_NOMBRE: '',
      CLI_DIRECCION: '',
      CLI_TELEFONO: 0,
      CLI_TIPOCLIENTE: '',
      VEN_PRECIOTOTAL: 0,
      VEN_ESTADOCREDITO: false,
      VEN_ENVIO: false,
      VEN_DOMICILIO: false,
      VEN_OBSERVACIONES: '',
      VEN_ACTUALIZACION: new Date(),
      USU_CEDULA: '',
      VEN_ESTADOVENTA: false,
      VEN_ESTADO: false,
      DetalleVentas: []
    };
    this.nuevoAbono = {
      CAR_CODIGO: 0,
      VEN_CODIGO: 0,
      CAR_FECHACREDITO: new Date(),
      CAR_VALORABONADO: 0,
      TIC_CODIGO: 0,
      TIC_NOMBRE: "",
      USU_CEDULA: ""
    };

    this.CuentaSeleccionada = {
      label: '',
      value: ''
    }
    this.credito = {
      CLI_ID: '',
      CLI_NOMBRE: '',
      Ventas: [],
      Carteras: [],
      TotalVendido: 0,
      TotalAbonado: 0,
      DiferenciaTotal: 0
    }
  }
  ngOnInit(): void {
    this.credito = this.config.data.Credito;
    this.ObtenerTipoCuentas();
    this.FormateoDeDatos();
  }
  FormateoDeDatos() {
    let fecha = new Date(this.venta.VEN_FECHAVENTA);
    this.venta.VEN_FECHAVENTA = new Date()
    this.venta.VEN_FECHAVENTA.setDate(fecha.getDate());
  }
  ObtenerTipoCuentas() {
    this.ventasService.BuscarTipoCuentas().subscribe((result: any) => {
      if (result === null) {
        this.alertasService.SetToast("No hay Cuentas asignadas.", 3);
        return;
      }
      this.listaTipoDeCuenta = result.filter((x: { TIC_NOMBRE: string; }) => !x.TIC_NOMBRE.toLocaleUpperCase().includes("CREDITO")).map((item: any) => {
        const selectItem: SelectItem = {
          label: item.TIC_NOMBRE,
          value: item.TIC_CODIGO
        }
        return selectItem;
      });

    });
  }
  CalcularSaldo() {
    this.CalcularTotalAbonado();
    this.saldo = this.venta.VEN_PRECIOTOTAL - this.totalAbonado;
    this.config.header = 'Saldo pendiente $' + (this.venta.VEN_ESTADOCREDITO == true ? this.saldo.toLocaleString('en-US') : 0);
  }
  CalcularTotalAbonado() {
    this.totalAbonado = this.abonos.reduce((total, elemento) => total + elemento.CAR_VALORABONADO, 0);
  }
  AgregarAbono() {
    if (this.ValidarIngresoAbono()) return;
    let cuenta = this.listaTipoDeCuenta.find(x => x.value == this.CuentaSeleccionada)?.value;
    this.nuevoAbono.TIC_CODIGO = cuenta;
    this.nuevoAbono.VEN_CODIGO = this.credito.Ventas[0].VEN_CODIGO;
    this.nuevoAbono.USU_CEDULA = this.userLogged.USU_CEDULA;
    this.alertasService.showLoading("Creando Abono");
    this.ventasService.CrearAbono(this.nuevoAbono).subscribe(x => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast('Se creo correctamente el abono', 1)
      this.ListarAbonos();
    }, err => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast('Error al crear el abono', 3)
      console.log(err);
    });
  }
  ValidarIngresoAbono(): boolean {
    if (this.CuentaSeleccionada == null) {
      this.alertasService.SetToast('Debe seleccionar un tipo de pago', 2)
      return true;
    };
    if (this.nuevoAbono.CAR_VALORABONADO <= 0 || this.nuevoAbono.CAR_VALORABONADO == null) {
      this.alertasService.SetToast('El valor abonado debe ser mayor a cero y diferente a vacio', 2)
      return true;
    };
    return false;
  }
  ListarAbonos() {
    this.alertasService.showLoading("Cargando información de crédito");
    this.creditoService.ObtenerCreditoCliente(this.credito.CLI_ID).subscribe((creditoAux: Icredito) => {
      this.alertasService.hideLoading();
      this.credito = creditoAux;
      this.LimpiarFormulario();
    }, err => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast('Error al traer los datos del crédito', 3)
    })
  }
  EliminarAbono(abono: Iabonos) {
    debugger
    this.alertasService.confirmacion("Esta seguro de eliminar el abono # " + abono.CAR_CODIGO + "?").then(result => {
      if (result) {
        this.alertasService.showLoading("Eliminano abono")
        if (abono.CAR_ESTADOCREDITO == 0) {
          this.ventasService.EliminarAbono(abono.CAR_CODIGO).subscribe(x => {
            this.alertasService.hideLoading();
            this.alertasService.SetToast("Se elimino corretamente", 1)
            this.ListarAbonos();
          }, err => {
            this.alertasService.hideLoading();
            this.alertasService.SetToast(err, 3)
          })
        }
        else {
          this.ventasService.AnularAbono(abono.CAR_CODIGO).subscribe(x => {
            this.alertasService.hideLoading();
            this.alertasService.SetToast("Se elimino corretamente", 1)
            this.ListarAbonos();
          }, err => {
            this.alertasService.hideLoading();
            this.alertasService.SetToast(err, 3)
          })
        }

      }
    })
  }
  SeleccionarAbono(abono: Iabonos) {
    this.nuevoAbono = abono;
    this.CuentaSeleccionada = this.listaTipoDeCuenta.find(x => x.value == this.nuevoAbono.TIC_CODIGO)?.value;
    let fecha = new Date(this.nuevoAbono.CAR_FECHACREDITO);
    this.nuevoAbono.CAR_FECHACREDITO = new Date()
    this.nuevoAbono.CAR_FECHACREDITO.setDate(fecha.getDate());
    this.esEditar = true;
  }
  ActualizarAbono() {
    if (this.ValidarIngresoAbono()) return;
    let cuenta = this.listaTipoDeCuenta.find(x => x.value == this.CuentaSeleccionada)?.value;
    this.nuevoAbono.TIC_CODIGO = cuenta;
    this.alertasService.showLoading("Actualizando Abono");
    this.ventasService.ActualizarAbono(this.nuevoAbono).subscribe(x => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast('Se creo actualizó el abono', 1)
      this.ListarAbonos();
    }, err => {
      this.alertasService.hideLoading();
      this.alertasService.SetToast('Error al actualizar el abono', 3)
      console.log(err);
    });
  }

  FinalizarCredito() {
    let mensaje = "¿Esta seguro de finalizar el credito?"
    if (this.saldo > 0) {
      mensaje = "Aun hay $" + this.saldo.toLocaleString('en-US') + "  pendiente ¿Esta seguro de finalizar el credito?"
    }
    debugger
    this.alertasService.confirmacion(mensaje).then(result => {
      if (result) {
        this.alertasService.showLoading("Finalizando credito")
        this.ventasService.FinalizarCredito(this.venta.VEN_CODIGO).subscribe(x => {
          this.alertasService.hideLoading();
          this.alertasService.SetToast("Se finalizó el credito corretamente", 1)
          this.ref.close(true);
        }, err => {
          this.alertasService.hideLoading();
          this.alertasService.SetToast(err, 3)
        })
      }
    })
  }
  LimpiarFormulario() {
    this.CuentaSeleccionada = {
      label: '',
      value: ''
    };
    this.nuevoAbono = {
      CAR_CODIGO: 0,
      VEN_CODIGO: 0,
      CAR_FECHACREDITO: new Date(),
      CAR_VALORABONADO: 0,
      TIC_CODIGO: 0,
      TIC_NOMBRE: ""
    };
    this.esEditar = false;
  }
  getSeverity(estado: any) {

    switch (estado) {
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        return "";
    }

  }
}

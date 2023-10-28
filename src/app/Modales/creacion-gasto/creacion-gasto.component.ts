import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IGasto } from 'src/app/Interfaces/igasto';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { SelectItem } from 'primeng/api';
import { GastosService } from 'src/app/Servicios/gastos.service';
import { MotivosGastosService } from 'src/app/Servicios/motivosgastos.service';
import { TipoCuentaService } from 'src/app/Servicios/tipocuenta.service';

@Component({
  selector: 'app-creacion-gasto',
  templateUrl: './creacion-gasto.component.html',
  styleUrls: ['./creacion-gasto.component.scss'],
})
export class CreacionGastoComponent implements OnInit {
  formularioGasto: FormGroup;
  listaCuenta: SelectItem[] = [];
  gastoAEditar: IGasto;
  esEdicion: boolean = false;
  listaMotivo: SelectItem[] = [];
  motivoSeleccionado: any;
  tipoDeCuentaSeleccionada: any;
  FechaActual: Date;
  userLogged: any;

  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private gastoService: GastosService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private motivoGastoService: MotivosGastosService,
    private tipoCuentaService: TipoCuentaService,
    private alertasService: AlertasService
  ) {
    this.userLogged=JSON.parse(localStorage.getItem('user')||"");
    this.FechaActual = new Date(Date.now());
    this.formularioGasto = this.formBuilder.group({
      GAS_VALOR: [null, Validators.required],
      GAS_PENDIENTE: [null, Validators.required],
      GAS_FECHAGASTO: [this.FechaActual, Validators.required],
      TIC_CODIGO: [null, Validators.required],
      MOG_CODIGO: [null, Validators.required],
    });
    this.gastoAEditar = {
      GAS_CODIGO: 0,
      MOTIVOSGASTOS: '',
      GAS_VALOR: 0,
      GAS_PENDIENTE: false,
      GAS_FECHAGASTO: new Date(),
      USU_CEDULA: '',
      GAS_FECHACREACION: new Date(),
      TIC_CODIGO: 0,
      VEN_CODIGO: 0,
      GAS_ESTADO: false,
      MOG_CODIGO: 0,
    };
  }

  ngOnInit() {
    this.CargarTipoPago();
    this.CargarDatosEnLosInputs();
    this.CargarMotivo();
  }

  SubmitFormulario() {
    console.log(this.gastoAEditar)
    if (this.esEdicion) {
      this.EditarGasto();
    } else {
      this.CrearGasto();
    }
  }

  EditarGasto() {
    for (const control in this.formularioGasto.controls) {
      if (this.formularioGasto.controls[control].invalid) {
        this.alerta.SetToast(`El campo ${control} está incompleto`, 2);
        return;
      }
  
    const codigoGasto = this.formularioGasto.get('GAS_CODIGO')?.value;
  
    const gastoAEditar: IGasto = {
      GAS_CODIGO: codigoGasto,
      MOTIVOSGASTOS: this.formularioGasto.get('MOTIVOSGASTOS')?.value,
      GAS_VALOR: this.formularioGasto.get('GAS_VALOR')?.value,
      GAS_PENDIENTE: this.formularioGasto.get('GAS_PENDIENTE')?.value,
      GAS_FECHAGASTO: this.formularioGasto.get('GAS_FECHAGASTO')?.value,
      USU_CEDULA: this.formularioGasto.get('USU_CEDULA')?.value,
      GAS_FECHACREACION: this.formularioGasto.get('GAS_FECHACREACION')?.value,
      TIC_CODIGO: this.formularioGasto.get('TIC_CODIGO')?.value,
      VEN_CODIGO: this.formularioGasto.get('VEN_CODIGO')?.value,
      GAS_ESTADO: this.formularioGasto.get('GAS_ESTADO')?.value,
      MOG_CODIGO: this.formularioGasto.get('MOG_CODIGO')?.value ,
    };
  
    this.alerta.showLoading('Actualizando gasto');
    this.gastoService.ActualizarGasto(codigoGasto, gastoAEditar).subscribe(
      (result) => {
        if (result) {
          this.alerta.SetToast('Gasto actualizado', 1);
          this.CerradoPantalla();
        } else {
          this.alerta.SetToast('Error al actualizar el gasto', 3);
        }
        this.alerta.hideLoading();
      },
      (error) => {
        this.alerta.SetToast('Error al actualizar el gasto: ' + error.message, 3);
        this.alerta.hideLoading();
      }
    );
  }
}
  CrearGasto() {
    for (const control in this.formularioGasto.controls) {
      if (this.formularioGasto.controls[control].invalid) {
        this.alerta.SetToast(`El campo ${control} está incompleto`, 2);
        return;
      }
    }
console.log(this.formularioGasto)
    const nuevoGasto: IGasto = {
      GAS_CODIGO: this.formularioGasto.get('GAS_CODIGO')?.value,
      MOTIVOSGASTOS: this.formularioGasto.get('MOTIVOSGASTOS')?.value,
      GAS_VALOR: this.formularioGasto.get('GAS_VALOR')?.value,
      GAS_PENDIENTE: this.formularioGasto.get('GAS_PENDIENTE')?.value,
      GAS_FECHAGASTO: this.formularioGasto.get('GAS_FECHAGASTO')?.value,
      USU_CEDULA: this.userLogged.USU_CEDULA, 
      GAS_FECHACREACION: this.formularioGasto.get('GAS_FECHACREACION')?.value,
      TIC_CODIGO: this.formularioGasto.get('TIC_CODIGO')?.value,
      VEN_CODIGO: this.formularioGasto.get('VEN_CODIGO')?.value,
      GAS_ESTADO: this.formularioGasto.get('GAS_ESTADO')?.value,
      MOG_CODIGO: this.formularioGasto.get('MOG_CODIGO')?.value,
    };

    this.alerta.showLoading('Creando nuevo gasto');
    this.gastoService.CrearGasto(nuevoGasto).subscribe(
      (result) => {
        if (result) {
          this.alerta.SetToast('Gasto creado', 1);
          this.CerradoPantalla();
        } else {
          this.alerta.SetToast('Error al crear el gasto', 3);
        }
        this.alerta.hideLoading();
      },
      (error) => {
        this.alerta.SetToast('Error al crear el gasto: ' + error.message, 3);
        this.alerta.hideLoading();
      }
    );
  }

  CerradoPantalla() {
    this.LimpiarPantalla();
    this.ref.close();
  }

  LimpiarPantalla() {
    this.formularioGasto.reset();
  }

  CargarTipoPago() {
    this.tipoCuentaService.ObtenerCuentas().subscribe((result: any) => {
      if (result) {
        this.listaCuenta = result.map((item: any) => {
          const selectItem: SelectItem = {
            label: item.TIC_NOMBRE,
            value: item.TIC_CODIGO,
          };
          return selectItem;
        });
  
        const tipoDeCuentaSeleccionada = this.listaCuenta.find((item) => item.value === this.gastoAEditar.TIC_CODIGO);
        if (tipoDeCuentaSeleccionada) {
          this.formularioGasto.get('TIC_CODIGO')?.setValue(tipoDeCuentaSeleccionada.value);
        }
      }
    });
  }
  

  CargarMotivo() {
    this.motivoGastoService.ObtenerMotivosGastos().subscribe((result: any) => {
      if (result) {
        this.listaMotivo = result.map((item: any) => {
          const selectItem: SelectItem = {
            label: item.MOG_NOMBRE,
            value: item.MOG_CODIGO,
          };
          return selectItem;
        });
        console.log(this.listaMotivo)
        const motivoSeleccionado = this.listaMotivo.filter((item) => item.value === this.gastoAEditar.MOG_CODIGO);
        if (motivoSeleccionado) {
          this.formularioGasto.get('MOG_CODIGO')?.setValue(motivoSeleccionado.values);
        }
      }
    });
  }

  private CargarDatosEnLosInputs() {
    this.esEdicion = this.config.data.esEdicion;
    this.gastoAEditar = this.config.data.gastoAEditar;

    if (this.esEdicion) {
      // Llena los campos del formulario con los valores del gasto a editar
      this.formularioGasto.get('GAS_CODIGO')?.setValue(this.gastoAEditar.GAS_CODIGO);
      this.formularioGasto.get('MOTIVOSGASTOS')?.setValue(this.gastoAEditar.MOTIVOSGASTOS);
      this.formularioGasto.get('GAS_VALOR')?.setValue(this.gastoAEditar.GAS_VALOR);
      this.formularioGasto.get('GAS_PENDIENTE')?.setValue(this.gastoAEditar.GAS_PENDIENTE);
      this.formularioGasto.get('GAS_FECHAGASTO')?.setValue(this.gastoAEditar.GAS_FECHAGASTO);
      this.formularioGasto.get('USU_CEDULA')?.setValue(this.gastoAEditar.USU_CEDULA);
    }
  }
}

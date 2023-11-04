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
      GAS_PENDIENTE: false,
      GAS_FECHAGASTO: [this.FechaActual, Validators.required],
      TIC_CODIGO: [null, Validators.required],
      MOG_CODIGO: [null, Validators.required],
      VEN_CODIGO :0,
      GAS_OBSERVACIONES:[null] 
    });
    this.gastoAEditar = {
      GAS_CODIGO: 0,
      GAS_VALOR: 0,
      GAS_PENDIENTE: false,
      GAS_FECHAGASTO: new Date(),
      USU_CEDULA: '',
      GAS_FECHACREACION: new Date(),
      TIC_CODIGO: 0,
      VEN_CODIGO: 0,
      GAS_ESTADO: false,
      MOG_CODIGO: 0,
      GAS_OBSERVACIONES:''
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
    if (this.formularioGasto.invalid) {
      this.alerta.SetToast('Por favor, complete todos los campos obligatorios', 2);
      return;
    }
  
    const codigoGasto = this.gastoAEditar.GAS_CODIGO;
  
    if (!codigoGasto) {
      this.alerta.SetToast('No se puede editar el gasto porque falta el código.', 2);
      return;
    }
  
    const nuevoGasto: IGasto = {
      GAS_CODIGO: codigoGasto,
      GAS_OBSERVACIONES:this.formularioGasto.get('GAS_OBSERVACIONES')?.value,
      GAS_VALOR: this.formularioGasto.get('GAS_VALOR')?.value,
      GAS_PENDIENTE: this.formularioGasto.get('GAS_PENDIENTE')?.value,
      GAS_FECHAGASTO: this.formularioGasto.get('GAS_FECHAGASTO')?.value,
      USU_CEDULA: this.userLogged.USU_CEDULA,
      TIC_CODIGO: this.formularioGasto.get('TIC_CODIGO')?.value,
      VEN_CODIGO: 0,
      GAS_ESTADO: true,
      MOG_CODIGO: this.formularioGasto.get('MOG_CODIGO')?.value,
      GAS_FECHACREACION:new Date(), 
    };
  
    this.alerta.showLoading('Actualizando gasto');
  
    this.gastoService.ActualizarGasto(codigoGasto.toString(), nuevoGasto).subscribe(
      (result) => {
        this.alerta.hideLoading();
        this.alerta.SetToast('Gasto Actualizado', 1);
        this.CerradoPantalla();
      },
      (err) => {
        this.alerta.hideLoading();
        this.alerta.SetToast('Error al actualizar el gasto: ' + err.message, 3);
        console.log(err);
      }
    );
  }
  
   
CrearGasto() {
    for (const control in this.formularioGasto.controls) {
      if (this.formularioGasto.controls[control].invalid) {
        this.alerta.SetToast(`El campo ${control} está incompleto`, 2);
        return;
      }
    }

    const nuevoGasto: IGasto = {
      GAS_CODIGO: this.formularioGasto.get('GAS_CODIGO')?.value,
      GAS_OBSERVACIONES: this.formularioGasto.get('GAS_OBSERVACIONES')?.value,
      GAS_VALOR: this.formularioGasto.get('GAS_VALOR')?.value,
      GAS_PENDIENTE: this.formularioGasto.get('GAS_PENDIENTE')?.value,
      GAS_FECHAGASTO: this.formularioGasto.get('GAS_FECHAGASTO')?.value,
      USU_CEDULA: this.userLogged.USU_CEDULA, 
      GAS_FECHACREACION: new Date(),
      TIC_CODIGO: this.formularioGasto.get('TIC_CODIGO')?.value,
      VEN_CODIGO: 0,
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
          return {
            label: item.TIC_NOMBRE,
            value: item.TIC_CODIGO,
          };
        });
  
        if (this.esEdicion) {
          this.formularioGasto.get('TIC_CODIGO')?.setValue(this.gastoAEditar.TIC_CODIGO);
        }
      }
    });
  }
  
  CargarMotivo() {
    this.motivoGastoService.ObtenerMotivosGastos().subscribe((result: any) => {
      if (result) {
        this.listaMotivo = result.map((item: any) => {
          return {
            label: item.MOG_NOMBRE,
            value: item.MOG_CODIGO,
          };
        });
  
        if (this.esEdicion) {
          this.formularioGasto.get('MOG_CODIGO')?.setValue(this.gastoAEditar.MOG_CODIGO);
        }
      }
    });
  }
  private CargarDatosEnLosInputs() {
    this.esEdicion = this.config.data.esEdicion;
    this.gastoAEditar = this.config.data.gastoAEditar;
  
    if (this.esEdicion) {
      // Llena los campos del formulario con los valores del gasto a editar
      this.formularioGasto.get('GAS_CODIGO')?.setValue(this.gastoAEditar.GAS_CODIGO.toString());

      this.formularioGasto.get('GAS_OBSERVACIONES')?.setValue(this.gastoAEditar.GAS_OBSERVACIONES);
      this.formularioGasto.get('GAS_VALOR')?.setValue(this.gastoAEditar.GAS_VALOR);
      this.formularioGasto.get('GAS_PENDIENTE')?.setValue(this.gastoAEditar.GAS_PENDIENTE);
      this.formularioGasto.get('GAS_FECHAGASTO')?.setValue(new Date(this.gastoAEditar.GAS_FECHAGASTO));
      this.formularioGasto.get('GAS_FECHACREACION')?.setValue(this.gastoAEditar.GAS_FECHACREACION)
      this.formularioGasto.get('USU_CEDULA')?.setValue(this.gastoAEditar.USU_CEDULA);
    } else {
      this.formularioGasto.get('GAS_FECHAGASTO')?.setValue(this.FechaActual);
    }
  }
  
  
}

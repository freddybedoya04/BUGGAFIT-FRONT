import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IGasto } from 'src/app/Interfaces/igasto';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { SelectItem } from 'primeng/api';
import { GastosService } from 'src/app/Servicios/gastos.service';

@Component({
  selector: 'app-creacion-gasto',
  templateUrl: './creacion-gasto.component.html',
  styleUrls: ['./creacion-gasto.component.scss'],
})
export class CreacionGastoComponent implements OnInit {
  formularioGasto: FormGroup;
  listaCedula: SelectItem[] = [];
  gastoAEditar: IGasto;
  esEdicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private alerta: AlertasService,
    private gastoService: GastosService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.formularioGasto = this.formBuilder.group({
      MOTIVOSGASTOS: [null, Validators.required],
      GAS_VALOR: [null, Validators.required],
      GAS_PENDIENTE: [null, Validators.required],
      GAS_FECHAGASTO: [null, Validators.required],
      USU_CEDULA: [null, Validators.required],
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
    this.CargarCedula();
    this.CargarDatosEnLosInputs();
  }

  SubmitFormulario() {
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
    }

    const codigoGasto = this.formularioGasto.get('GAS_CODIGO')?.value;

    this.gastoService.BuscarGastoID(codigoGasto).subscribe(
      (gastoExistente: IGasto) => {
        if (!gastoExistente) {
          this.alerta.SetToast('No se encontró el gasto que desea editar.', 2);
        } else {
          const gastoAEditar: IGasto = {
           GAS_CODIGO:codigoGasto,
            MOTIVOSGASTOS: this.formularioGasto.get('MOTIVOSGASTOS')?.value,
            GAS_VALOR: this.formularioGasto.get('GAS_VALOR')?.value,
            GAS_PENDIENTE: this.formularioGasto.get('GAS_PENDIENTE')?.value,
            GAS_FECHAGASTO: this.formularioGasto.get('GAS_FECHAGASTO')?.value,
            USU_CEDULA: this.formularioGasto.get('USU_CEDULA')?.value,
            GAS_FECHACREACION: this.formularioGasto.get('GAS_FECHACREACION')?.value,
            TIC_CODIGO: this.formularioGasto.get('TIC_CODIGO')?.value,
            VEN_CODIGO: this.formularioGasto.get('VEN_CODIGO')?.value,
            GAS_ESTADO: this.formularioGasto.get('GAS_ESTADO')?.value,
            MOG_CODIGO: this.formularioGasto.get('MOG_CODIGO')?.value,
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
      MOTIVOSGASTOS: this.formularioGasto.get('MOTIVOSGASTOS')?.value,
      GAS_VALOR: this.formularioGasto.get('GAS_VALOR')?.value,
      GAS_PENDIENTE: this.formularioGasto.get('GAS_PENDIENTE')?.value,
      GAS_FECHAGASTO: this.formularioGasto.get('GAS_FECHAGASTO')?.value,
      USU_CEDULA: this.formularioGasto.get('USU_CEDULA')?.value,
      GAS_FECHACREACION: this.formularioGasto.get('GAS_FECHACREACION')?.value,
      TIC_CODIGO: this.formularioGasto.get('TIC_CODIGO')?.value,
      VEN_CODIGO: this.formularioGasto.get('VEN_CODIGO')?.value,
      GAS_ESTADO: this.formularioGasto.get('GAS_ESTADO')?.value,
      MOG_CODIGO: this.formularioGasto.get('MOG_CODIGO')?.value,
      GAS_CODIGO:this.formularioGasto.get('GAS_CODIGO')?.value,
      
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

  CargarCedula() {
    // Aquí debes cargar las cédulas para tu lista desplegable, similar a la lógica que utilizas en la función ObtenerCategorias y ObtenerMarcas de CreacionProductoComponent.
  }

  private CargarDatosEnLosInputs() {
    this.esEdicion = this.config.data.esEdicion;
    this.gastoAEditar = this.config.data.gastoAEditar;

    if (this.esEdicion) {
      this.formularioGasto.get('GAS_CODIGO')?.setValue(this.gastoAEditar.GAS_CODIGO);
      this.formularioGasto.get('MOTIVOSGASTOS')?.setValue(this.gastoAEditar.MOTIVOSGASTOS);
      this.formularioGasto.get('GAS_VALOR')?.setValue(this.gastoAEditar.GAS_VALOR);
      this.formularioGasto.get('GAS_PENDIENTE')?.setValue(this.gastoAEditar.GAS_PENDIENTE);
      this.formularioGasto.get('GAS_FECHAGASTO')?.setValue(this.gastoAEditar.GAS_FECHAGASTO);
      this.formularioGasto.get('USU_CEDULA')?.setValue(this.gastoAEditar.USU_CEDULA);
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
//loading
import { LoadingComponent } from 'src/app/Modales/loading/loading.component';
//libreria primeNG
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { Card, CardModule } from 'primeng/card';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [LoadingComponent],
  imports: [
    CommonModule,
    ButtonModule,CalendarModule,
    FormsModule,
    TableModule,
    CardModule,
    InputTextModule,
    ToastModule,
    ReactiveFormsModule

  ],
  exports:[
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    CardModule,
    InputTextModule,
    LoadingComponent,
    ToastModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }

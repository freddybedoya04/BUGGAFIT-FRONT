import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
//loading
import { LoadingComponent } from 'src/app/Modales/loading/loading.component';
import {NgxPrintModule} from 'ngx-print';
//libreria primeNG
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { Card, CardModule } from 'primeng/card';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { Tag, TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { PasswordModule } from 'primeng/password';


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
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    DynamicDialogModule,
    TagModule,
    ConfirmDialogModule,
    TabMenuModule,
    TooltipModule,
    ChartModule,
    PanelModule,
    AccordionModule,
    NgxPrintModule,
    PasswordModule
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
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    DynamicDialogModule,
    TagModule,
    ConfirmDialogModule,
    TabMenuModule,
    TooltipModule,
    ChartModule,
    PanelModule,
    AccordionModule,
    NgxPrintModule,
    PasswordModule
  ]
})
export class SharedModule { }

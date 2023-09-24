import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//libreria primeNG
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import {TableModule} from 'primeng/table'





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    SidebarModule,
    PanelModule,
    MenuModule,
    CardModule,
    TableModule
    
  
  ],
  exports:[
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    SidebarModule,
    PanelModule,
    MenuModule,
    CardModule,
    TableModule
  ]
})
export class SharedModule { }

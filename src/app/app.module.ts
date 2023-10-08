import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Componentes/login/login.component';
import { SharedModule } from './Shared/shared/shared.module';
import { ConfirmationService, MessageService,  } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [MessageService,DialogService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

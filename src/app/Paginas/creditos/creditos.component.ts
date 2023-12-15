import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Icredito } from 'src/app/Interfaces/icredito';
import { AbonosComponent } from 'src/app/Modales/abonos/abonos.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { CreditosService } from 'src/app/Servicios/credito.service';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss']
})
export class CreditosComponent implements OnInit{
  searchKeyword:string="";
  creditos:Icredito[]=[];
  constructor(private creditoService:CreditosService,private alertasService:AlertasService,
    private dialogService:DialogService){

  }
  ngOnInit(): void {
    this.ObtenerCreditos();
  }
  ObtenerCreditos(){
    this.alertasService.showLoading("Cargando creditos")
    this.creditoService.ObtenerPersonasCredito().subscribe(x =>{
      
      this.alertasService.hideLoading();
      this.creditos=x;
    },err =>{
      this.alertasService.hideLoading();
      this.alertasService.SetToast("Error al consultar creditos",3)
      console.log(err)
    })
  }

  AbrirModal(credito:Icredito) {
    let ref = this.dialogService.open(AbonosComponent, {
      header: 'Crédito '+ credito.CLI_NOMBRE,
      width: '75%',
      baseZIndex: 100,
      maximizable: true,
      contentStyle:{'background-color':'#eff3f8'},
      data:{Credito:credito}
    })
    ref.onClose.subscribe((res) => {
        this.ObtenerCreditos();
    });
  }
}

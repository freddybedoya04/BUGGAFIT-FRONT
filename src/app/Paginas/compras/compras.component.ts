import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Icompras } from 'src/app/Interfaces/icompra';
import { IFiltro } from 'src/app/Interfaces/ifiltro';
import { CreacionCompraComponent } from 'src/app/Modales/creacion-compra/creacion-compra.component';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { ComprasService } from 'src/app/Servicios/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  //declacion variables
  FechaInicio: Date;
  FechaFin: Date;
  compras: Icompras[] = [];
  public searchKeyword: string = '';
  filtro: IFiltro;
  constructor(private alertas: AlertasService, private _comprasService: ComprasService, public dialogService: DialogService) {
    this.FechaInicio = new Date();
    this.FechaFin = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
    }
  }
  ngOnInit(): void {
    this.alertas.SetToast("inicio", 1);
    this.llenadocompras();
  }
  AbrirModalCreacion() {
    let ref = this.dialogService.open(CreacionCompraComponent, {
      
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    })
  }

  llenadocompras() {
    this.compras = [

      {
        COM_CODIGO: 1,
        COM_FECHACREACION: new Date(),
        COM_FECHACOMPRA: new Date(),
        COM_VALORCOMPRA: 100.0,
        COM_PROVEEDOR: 'Proveedor 1',
        TIC_CODIGO: 1,
        COM_FECHAACTUALIZACION: new Date(),
        COM_ENBODEGA: true,
        COM_ESTADO: true,
        COM_CREDITO: false,
        USU_CEDULA: '12345',
      }, {
        COM_CODIGO: 2,
        COM_FECHACREACION: new Date(),
        COM_FECHACOMPRA: new Date(),
        COM_VALORCOMPRA: 200.0,
        COM_PROVEEDOR: 'Proveedor 2',
        TIC_CODIGO: 2,
        COM_FECHAACTUALIZACION: new Date(),
        COM_ENBODEGA: false,
        COM_ESTADO: true,
        COM_CREDITO: true,
        USU_CEDULA: '67890',
      },
      {
        COM_CODIGO: 3,
        COM_FECHACREACION: new Date(),
        COM_FECHACOMPRA: new Date(),
        COM_VALORCOMPRA: 200.0,
        COM_PROVEEDOR: 'Proveedor 2',
        TIC_CODIGO: 1,
        COM_FECHAACTUALIZACION: new Date(),
        COM_ENBODEGA: false,
        COM_ESTADO: true,
        COM_CREDITO: true,
        USU_CEDULA: '67890',
      },
      {
        COM_CODIGO: 4,
        COM_FECHACREACION: new Date(),
        COM_FECHACOMPRA: new Date(),
        COM_VALORCOMPRA: 200.0,
        COM_PROVEEDOR: 'Proveedor 2',
        TIC_CODIGO: 2,
        COM_FECHAACTUALIZACION: new Date(),
        COM_ENBODEGA: false,
        COM_ESTADO: true,
        COM_CREDITO: true,
        USU_CEDULA: '67890',
      },
    ]
  }

  BuscarComprasPorFechas() {
    this.ArmarFiltro();
    this.alertas.showLoading("Buscando compras...")
    this._comprasService.BuscarComprarPorFechas(this.filtro).subscribe(result => {
      this.alertas.hideLoading();
      this.alertas.SetToast("Se encontraron " + result.length + " compras", 1)
      this.compras = result;
    }, err => {
      this.alertas.hideLoading();
      this.alertas.SetToast(err, 3);
    })
  }
  ArmarFiltro() {
    this.filtro.FechaFin = this.FechaFin.toISOString();
    this.filtro.FechaInicio = this.FechaInicio.toISOString();
  }

  exportExcel() {
    // import("xlsx").then((xlsx) => {
    //   const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.Viajes);


    //   const headerRow = this.table.el.nativeElement.querySelector('thead > tr');
    //   const headerCells = Array.from(headerRow.children);
    //   const header = headerCells.map((cell: any) => cell.innerText.trim());


    //   const headerRowIndex = 0;
    //   header.forEach((title, columnIndex) => {
    //     const cellRef = xlsx.utils.encode_cell({ r: headerRowIndex, c: columnIndex });
    //     worksheet[cellRef] = { t: 's', v: title };
    //   });

    //   const workbook: xlsx.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, 'viajes');
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const EXCEL_EXTENSION = '.xlsx';
    // const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

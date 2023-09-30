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
    this.FechaFin = new Date();
    this.FechaInicio = new Date();
    this.filtro = {
      FechaFin: "",
      FechaInicio: ""
    }
  }
  ngOnInit(): void {
    this.ConfigurarFechas();
  }
  ConfigurarFechas() {
    this.FechaFin = new Date();
    this.FechaInicio = new Date(this.FechaFin)
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 7);
  }
  AbrirModalCreacion() {
    let ref = this.dialogService.open(CreacionCompraComponent, {
      header: 'Nueva Compra',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    })

    ref.onClose.subscribe((res) => {
      debugger;
      this.FechaFin = new Date(Date.now());
      this.BuscarComprasPorFechas();
    });
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
  getSeverity(bodega: boolean, estado: boolean) {
    if (bodega) {
      switch (estado) {
        case true:
          return 'success';
        case false:
          return 'danger';
      }
    }
    switch (estado) {
      case true:
        return 'danger';
      case false:
        return 'success';
    }

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

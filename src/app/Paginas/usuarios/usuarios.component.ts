import { Component, OnInit,ViewChild } from '@angular/core';
import { CreacionUsuarioComponent } from 'src/app/Modales/creacion-usuario/creacion-usuario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertasService } from 'src/app/Servicios/alertas.service';
import { Iusuario } from 'src/app/Interfaces/iusuario';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import * as FileSaver from 'file-saver'; 
import * as XLSX from 'xlsx'; 



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  ListaUsuario:Iusuario[]=[];
  public searchKeyword: string = '';
  @ViewChild('dt2', { static: true }) table: any;


constructor(public dialogService: DialogService, private UsuarioService: UsuarioService, private alertasService: AlertasService){

}
ngOnInit(): void {
  this.ListarUsuarios();
    
}

AbrirModalUsuario(){
  let ref = this.dialogService.open(CreacionUsuarioComponent, {
    header: 'Nuevo Usuario',
    width: '60%',
    contentStyle: { overflow: 'auto','background-color':'#eff3f8'  },
    baseZIndex: 100,
    maximizable: true,
    data:{esEdicion:false}
  });
  ref.onClose.subscribe((res) => {
    debugger;
    this.ListarUsuarios();
  });
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.ListaUsuario);
  
      const headerRow = this.table.el.nativeElement.querySelector('thead > tr');
      const headerCells = Array.from(headerRow.children);
      const headerMap = new Map<string, number>();
  
      
      headerCells.forEach((cell: any, columnIndex) => {
        const columnName = cell.innerText.trim();
        headerMap.set(columnName, columnIndex);
      });
  
      const headerRowIndex = 0;
      headerMap.forEach((columnIndex, columnName) => {
        const cellRef = xlsx.utils.encode_cell({ r: headerRowIndex, c: columnIndex });
        worksheet[cellRef] = { t: 's', v: columnName };
      });
  
      const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'usuarios');
    });
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  
  EliminarUsuario(usuario: Iusuario) {
    this.alertasService.confirmacion("¿Desea eliminar al usuario con cédula: " + usuario.USU_CEDULA + "?").then((resolve: any) => {
      if (resolve) {
        this.alertasService.showLoading('Eliminando el usuario');
        this.UsuarioService.EliminarUsuario(usuario.USU_CEDULA).subscribe(
          (result) => {
            if (result == null || result?.StatusCode.toString().indexOf('20') >= 0) {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Usuario Eliminado', 1);
              this.ListarUsuarios(); // Vuelve a cargar la lista de usuarios después de eliminar
            } else {
              this.alertasService.hideLoading();
              this.alertasService.SetToast('Error al eliminar el usuario: ' + result?.message, 3);
              console.error(result);
            }
          }
        );
      }
    });
  }
  EditarUsuario(usuario: Iusuario){
    let ref=this.dialogService.open(CreacionUsuarioComponent,{
      header: 'Editar Usuario',
      width: '60%',
      contentStyle: { overflow: 'auto','background-color': '#eff3f8' },
      baseZIndex: 100,
      maximizable: true,
      data: { esEdicion: true, usuarioAEditar: usuario }
    });
    ref.onClose.subscribe((res) => {
      this.ListarUsuarios();
    });
  };
  ListarUsuarios() {
    this.UsuarioService.ListarUsuarios().subscribe(
      (result: any) => {
        if (!result || result === null) {
          this.alertasService.SetToast("No hay usuarios para mostrar", 2);
          return;
        }
        this.ListaUsuario= result;
      });
  
  }

}


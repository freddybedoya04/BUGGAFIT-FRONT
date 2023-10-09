import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  private isLoading = new BehaviorSubject<boolean>(false);
  private loadingMessage = new BehaviorSubject<string>('Cargando1...'); // Mensaje por defecto
  constructor(private _message: MessageService,private confirmationService:ConfirmationService) { }
  SetToast(texto: string, tipo: 1 | 2 | 3, life: number= 6000) {

    let asunto;
    let titulo;
    switch (tipo) {
      case 1:
        asunto = 'success'; titulo = 'Exito'
        break;
      case 2:
        asunto = 'warn'; titulo = 'Aviso'
        break;
      case 3:
        asunto = 'error'; titulo = 'Error'
        break;
    }
    const toast: Message = {
      severity: asunto,
      summary: titulo,
      detail: texto,
      life: life
    };
    this._message.add(toast);
  }

  confirmacion(Mensaje: string): Promise<boolean> {
    debugger
    return new Promise<boolean>((resolve, reject) => {
      this.confirmationService.confirm({
        message: Mensaje,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          resolve(true); // Resuelve la promesa con 'true' cuando se acepta.
        },
        reject: () => {
          resolve(false); // Resuelve la promesa con 'false' cuando se rechaza.
        }
      });
    });
  }
  showLoading(message?: string) {
    this.isLoading.next(true);
    if (message) {
      this.loadingMessage.next(message);
    }
  }

  hideLoading() {
    this.isLoading.next(false);
  }

  get loading() {
    return this.isLoading.asObservable();
  }
  get message() {
    return this.loadingMessage.asObservable();
  }
}

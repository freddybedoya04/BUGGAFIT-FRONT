import { IdetalleCompra } from "./iproducto-comprado";

export interface Icompras {
    COM_CODIGO: number;
    COM_FECHACREACION: Date;
    COM_FECHACOMPRA: Date;
    COM_VALORCOMPRA: number;
    COM_PROVEEDOR: string;
    TIC_CODIGO: number;
    TIC_NOMBRE?:string;
    COM_FECHAACTUALIZACION: Date;
    COM_ENBODEGA: boolean;
    COM_ESTADO: boolean;
    COM_CREDITO: boolean;
    USU_CEDULA: string;
    DetalleCompras?:IdetalleCompra[];
  }
  
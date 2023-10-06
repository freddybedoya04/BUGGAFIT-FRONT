import { IDetalleVentas } from "./idetalle-ventas"

export interface Iventa {
VEN_CODIGO : number,
VEN_FECHACREACION:Date,
VEN_FECHAVENTA : Date,
VEN_TIPOPAGO? : string,
TIC_CODIGO :number,
TIC_NOMBRE?:string,
CLI_ID :number,
CLI_NOMBRE?:string,
CLI_DIRECCION?:string,
CLI_TELEFONO?:string,
CLI_TIPOCLIENTE?:string,
VEN_PRECIOTOTAL : string,
VEN_ESTADOCREDITO : boolean,
VEN_ENVIO :boolean,
VEN_DOMICILIO :boolean,
VEN_OBSERVACIONES : string,
VEN_ACTUALIZACION : Date,
USU_CEDULA : string,
VEN_ESTADOVENTA : boolean,
VEN_ESTADO : boolean
DetalleVenta?:IDetalleVentas[];
}

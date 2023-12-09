export interface ITipocuenta {
    TIC_CODIGO: number;
    TIC_NOMBRE: string;
    TIC_NUMEROREFERENCIA: number;
    TIC_FECHACREACION: Date;
    TIC_ESTADO: boolean;
    TIC_DINEROTOTAL?:number
    TIC_ESTIPOENVIO?:boolean;
}

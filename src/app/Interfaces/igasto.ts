export interface IGasto {
    GAS_CODIGO: number;
    GAS_ESTADO: boolean;
    GAS_FECHACREACION: Date;
    GAS_FECHAGASTO: Date;
    GAS_PENDIENTE: boolean;
    GAS_VALOR: number;
    MOG_CODIGO: number;
    TIC_CODIGO: number;
    USU_CEDULA: string;
    VEN_CODIGO?: number;
    MOG_NOMBRE?:string;
    GAS_OBSERVACIONES?:string
}
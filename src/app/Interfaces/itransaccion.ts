export interface ITransaccion {
    TRA_CODIGO: number;
    TIC_CUENTA: number;
    TRA_TIPO: string;
    TRA_FECHACREACION: string;
    TRA_CONFIRMADA: boolean;
    TRA_ESTADO: boolean;
    TRA_FECHACONFIRMACION?: string;
    TRA_CODIGOENLACE?: string;
    TRA_FUEANULADA: boolean;
    TRA_NUMEROTRANSACCIONBANCO?: number;
    USU_CEDULA_CONFIRMADOR: string;
    TRA_VALOR?: number;
    TIC_CODIGO: number;
    GAS_VALOR?:number;
    CLI_NOMBRE?: string;
}

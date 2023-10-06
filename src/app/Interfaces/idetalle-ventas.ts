export interface IDetalleVentas {
    VED_CODIGO: number;
    VEN_CODIGO: number; 
    PRO_CODIGO: string | null; 
    PRO_NOMBRE: string | null; 
    VED_UNIDADES: string | null;
    VED_PRECIOVENTA_UND: number;
    VED_VALORDESCUENTO_UND: number;
    VED_PRECIOVENTA_TOTAL: number;
    VED_ACTUALIZACION: Date;
    VED_ESTADO: boolean;
}

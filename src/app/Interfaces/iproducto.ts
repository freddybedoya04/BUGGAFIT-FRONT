export interface Iproducto {
    PRO_CODIGO: string
    PRO_NOMBRE: string;
    PRO_MARCA: string;
    PRO_CATEGORIA: string;
    PRO_PRECIO_COMPRA: number;
    PRO_PRECIOVENTA_DETAL: number;
    PRO_PRECIOVENTA_MAYORISTA: number;
    PRO_UNIDADES_DISPONIBLES: number;
    PRO_UNIDADES_MINIMAS_ALERTA: number;
    PRO_ACTUALIZACION: Date;
    PRO_FECHACREACION: Date;
    PRO_ESTADO: boolean;
    COM_CANTIDAD?:number;
    EstaEnAlerta?: boolean;
    PRO_REGALO?:boolean;
    PRO_UNIDADREGALO?:number;
    PRO_UNIDAD_MINIMAREGALO?:number;
  }
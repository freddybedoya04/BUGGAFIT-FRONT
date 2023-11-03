import { Iventa } from "./iventa"
import { Iabonos } from "./iabonos"
export interface Icredito {
    CLI_ID: string;
    CLI_NOMBRE: string;
    Ventas: Iventa[];
    Carteras: Iabonos[];
    TotalVendido: number;
    TotalAbonado: number;
    DiferenciaTotal: number;
}

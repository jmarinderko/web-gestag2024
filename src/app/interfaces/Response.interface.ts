import { Cardinfo } from "./Cardinfo.interface";
import { LoadFile } from "./LoadFile.interface";
import { Pay, PaymentBox } from "./Pay.interface";
import { TransitTaxe } from "./TransitTaxe.interface";

export interface Response {
    success: boolean;
    message: string;
    data:
        | any
        | Cardinfo
        | TransitTaxe[]
        | TransitTaxe
        | Pay[]
        | Pay
        | PaymentBox[]
        | PaymentBox
        | null
        | DataTransittaxes
        | LoadFile
        | LoadFile[];
}

export interface DataTransittaxes {
    transittaxes: TransitTaxe[];
    others: Other[];
    othersRuts: OthersRut[];
}

export interface Other {
    patente: string;
    cantidad: number;
}

export interface OthersRut {
    rut: number;
    dv_rut: string;
}

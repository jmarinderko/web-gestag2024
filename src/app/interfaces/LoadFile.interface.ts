import { Higway } from "./TransitTaxe.interface";

export interface LoadFile {
    id: number;
    nombre: string;
    fecha: string;
    numero: string;
    cant_informadas: number;
    path: string;
    path_zip: null;
    estado: number;
    id_entidad: number;
    id_autopista: number;
    created_at: string;
    updated_at: string;
    higway: Higway | null;
}

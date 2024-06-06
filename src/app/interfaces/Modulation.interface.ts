export interface Modulation {
    id: number;
    fecha_desde: Date;
    fecha_hasta: Date;
    ruta_excel_salida: null;
    ruta_excel_recepcion: string;
    cantidad: number;
    estado: number;
    tipo: number;
}


export interface Process {
    id: number;
    fecha_generacion: Date;
    url_documento: null;
    tipo: number;
    tipo_carta: number;
    estado: number;
    cantidad: number;
    id_modulaciones: number;
    created_at: Date;
    updated_at: Date;
}

export interface ProcessModulation {
    id: number;
    fecha_generacion: Date;
    url_documento: null;
    tipo: number;
    tipo_carta: number;
    estado: number;
    cantidad: number;
    id_modulaciones: number;
    created_at: Date;
    updated_at: Date;
    fecha_desde: Date;
    fecha_hasta: Date;
    ruta_excel_recepcion: string;
    cantidades_impresas: number;
    autopista_nombre: string;
}

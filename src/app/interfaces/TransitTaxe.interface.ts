import { Pay } from "./Pay.interface";

export interface TransitTaxe {
    id: number;
    id_pdf: number;
    autopista: number;
    rut: number;
    dv_rut: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    comuna: string;
    direccion: string;
    patente: string;
    d_patente: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    tipo_vehiculo: string;
    fecha_infraccion: string;
    hora_infraccion: string;
    portico: string;
    descripcion: string;
    correlativo_muni: string;
    correlativo_mop: string;
    inspector: string;
    cargo: string;
    id_resolucion: null;
    id_pago: null;
    id_cd_carga: number;
    id_autopista: number;
    estado: number;
    id_entidad: number;
    fecha_carga: string;
    fecha_traspaso: string;
    fecha_archivado: null;
    ubicacion: number;
    id_razon: number;
    codigo_resolucion: null;
    observacion: null;
    url_resolucion: null;
    created_at: string;
    updated_at: string;
    rol_juzgado: string;
    fecha_recepcion: string;
    anio_jpl: number | null;
    higway: Higway | null;
    cd_load: CDLoad | null;
    reason: Reason | null;
    infraccionesDate: Observation[] | null;
    pay: Pay | null;
}


export interface Reason {
    id: number;
    nombre: string;
    descripcion: string;
    tipo_razon: number;
    lugar: number;
    created_at: string;
    updated_at: string;
}

export interface Higway {
    id: number;
    nombre: string;
    sigla: string;
    created_at: string;
    updated_at: string;
}

export interface CDLoad {
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
}

export interface Observation {
    id: number;
    fecha: string;
    estado: number;
    tipo: number;
    id_infraccion: number;
    observacion: null;
    created_at: null;
    updated_at: null;
    reason: Reason;
}

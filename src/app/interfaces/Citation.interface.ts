export interface Citations {
    citations: Citation[];
    countInfraccionesGroupByEntity: CountInfraccionesGroupByEntity;
    countInfraccionesGroupByEntityAndMonthandYear: CountInfraccionesGroupByEntityAndMonthandYear[];
}

export interface Citation {
    id: number;
    cantidad: number;
    fecha_citacion: Date;
    mes: number;
    anio: number;
    id_usuario: number;
    id_entidad: number;
}

export interface CountInfraccionesGroupByEntity {
    cantidad: number;
}

export interface CountInfraccionesGroupByEntityAndMonthandYear {
    cantidad: number;
    mes: string;
    anio: string;
}

export interface Qtyavailable {
    cantidad: number;
    fecha_minima: Date;
    fecha_maxima: Date;
}

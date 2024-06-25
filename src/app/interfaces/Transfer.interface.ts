export interface Transfer {
    id: number;
    fecha_traspaso: Date;
    entidad_desde: number;
    entidad_hasta: number;
    id_usuario: number;
    documento: null;
    tipo_traspaso: number;
    estado: number;
    numero_memo: number;
    mes_traspaso: null;
    anio_traspaso: null;
    personal_desde: string;
    personal_hasta: string;
    fecha_recepcion: Date;
    id_usuario_recepcion: number;
    usuario: string;
    usuario_apellido: string;
    usuario_recepcion: string;
    usuario_recepcion_apellido: string;
    cantidad_infracciones: number;
}

export interface TransferAvailable {
    fecha_minima: Date;
    fecha_maxima: Date;
    cantidad:     number;
    mes:          string;
    anio:         string;
}

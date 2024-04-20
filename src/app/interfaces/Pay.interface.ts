export interface Pay {
    id: number;
    folio: string;
    orden_pago: string;
    valor_pago: number;
    valor_descuento: number;
    porcentaje_descuento: number;
    id_entidad: number;
    valor_utm: number;
    tipo_pago: number;
    fecha_pago: string;
    id_caja: number;
    id_infraccion: number;
    url_documento: string;
    codigo_interno: string;
    codigo_transaccion: string;
    observacion: string;
    created_at: string;
    updated_at: string;
    paymentBox: PaymentBox;
}

export interface PaymentBox {
    id: number;
    numero_caja: number;
    id_entidad: number;
    tipo_pago_entidad: number;
    id_personal: null;
    created_at: string;
    updated_at: string;
}

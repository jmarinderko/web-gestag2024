export interface Cardinfo {
    title: string;
    items: CardinfoItem[];
}

export interface CardinfoItem {
    label: string;
    valor: number | string;
}

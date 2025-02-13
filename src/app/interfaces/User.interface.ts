export interface User {
    id: number;
    nombre: string;
    apellido: string;
    tipo_usuario: string;
    id_entidad: number;
    login: string;
    roles: Role[];
    modules?: Module[];
}

export interface Role {
    id: number
    name: string
    description: string
    modules?: Module[]
}

export interface Module {
    id: number;
    name: string;
    description: string;
    label: string;
    icon: string;
    routerlink: string;
    level: number;
    position: number;
    moduleid: number;
    selected?: boolean;
}

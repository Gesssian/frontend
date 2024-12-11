export type T_Climber = {
    id: string
    name: string
    description: string
    peak: string
    image: string
    status: number
    count?: string
}

export type T_Expedition = {
    id: string | null
    status: E_ExpeditionStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    climbers: T_Climber[]
    cost: number
    date: string
}
export enum E_ExpeditionStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    is_authenticated: boolean
    is_superuser: boolean
}

export type T_ExpeditionsFilters = {
    date_formation_start: string
    date_formation_end: string
    status: number
    owner: string
}

export type T_ClimbersListResponse = {
    climbers: T_Climber[],
    draft_expedition_id?: number,
    climbers_count?: number
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    name: string
    email: string
    password: string
}

export type T_ClimberAddData = {
    name: string;
    description: string;
    peak: number;
    image?: File | null;
}
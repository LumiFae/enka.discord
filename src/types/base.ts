export interface NormalizedAvatarMeta {
    id: string;
    nameHash: string;
    element: string;
    role: string;
    rarity: number;
    excel: Object;
}

export interface NormalizedAvatar {
    level: number;
    ascension: number;
    const: number;
    meta: NormalizedAvatarMeta;
    data: Object;
    weapon: NormalizedWeapon;
    relics: (NormalizedRelic | null)[];
    relicsGroupedBySet: Record<string, NormalizedRelic[]>;
    rollSummary: Object[];
    smallImage: string;
    splashImage: string;
    tileImage: string;
}

export interface NormalizedWeaponMeta {
    id: string;
    image: string;
    smallImage: string;
    nameHash: string;
    role: string;
    rarity: number;
    excel: Object;
}

export interface NormalizedWeapon {
    level: number;
    ascension: number;
    refine: number;
    meta: NormalizedWeaponMeta;
    stats: Function;
}

export interface NormalizedRelicMeta {
    id: string;
    image: string;
    smallImage: string;
    nameHash: string;
    rarity: number;
    set: any;
    excel: any;
}

export interface NormalizedRelic {
    level: number;
    meta: NormalizedRelicMeta;
    stats: Function;
}

export interface NormalizedProperty {
    id: number | string;
    value: number;
    level?: number;
    name: string;
}

export interface NormalizedPlayerInfo {
    nickname: string;
    signature: string;
    uid: string;
    server: string;
    pfp: string;
    level: number;
    worldLevel: number | null;
    background: string;
    stats: NormalizedStatistic[];
}

export interface NormalizedStatistic {
    id?: string;
    icon: string;
    nameHash: string;
    value: string;
    excel?: Object;
}
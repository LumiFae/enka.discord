import type {
    NormalizedAvatarMeta as BaseNormalizedAvatarMeta,
    NormalizedWeaponMeta as BaseNormalizedWeaponMeta,
    NormalizedRelicMeta as BaseNormalizedRelicMeta,
} from './base';
import {UIDResponse} from "./models";

export const Element = {
    Ice: 'Ice',
    Wind: 'Wind',
    Fire: 'Fire',
    Imaginary: 'Imaginary',
    Thunder: 'Thunder',
    Quantum: 'Quantum',
    Physical: 'Physical',
} as const;

export type Element_T = (typeof Element)[keyof typeof Element];

export const Role = {
    Knight: 'Knight',
    Rogue: 'Rogue',
    Mage: 'Mage',
    Warlock: 'Warlock',
    Warrior: 'Warrior',
    Shaman: 'Shaman',
    Priest: 'Priest',
} as const;

export type Role_T = (typeof Role)[keyof typeof Role];

export const PropType = {
    HPDelta: 'HPDelta',
    AttackDelta: 'AttackDelta',
    DefenceDelta: 'DefenceDelta',
    HPAddedRatio: 'HPAddedRatio',
    AttackAddedRatio: 'AttackAddedRatio',
    DefenceAddedRatio: 'DefenceAddedRatio',
    SpeedDelta: 'SpeedDelta',
    CriticalChanceBase: 'CriticalChanceBase',
    CriticalDamageBase: 'CriticalDamageBase',
    StatusProbabilityBase: 'StatusProbabilityBase',
    StatusResistanceBase: 'StatusResistanceBase',
    BreakDamageAddedRatioBase: 'BreakDamageAddedRatioBase',
} as const;

export interface ExcelNameHash {
    Hash: number;
}

export interface ExcelAvatar {
    AvatarName: ExcelNameHash;
    AvatarFullName: ExcelNameHash;
    Rarity: number;
    Element: Element_T;
    AvatarBaseType: Role_T;
    AvatarSideIconPath: string;
    ActionAvatarHeadIconPath: string;
    AvatarCutinFrontImgPath: string;
    RankIDList: readonly number[];
    SkillList: readonly number[];
}

export interface NormalizedAvatarMeta extends BaseNormalizedAvatarMeta {
    element: Element_T;
    role: Role_T;
    excel: ExcelAvatar;
}

export interface ExcelWeapon {
    Rarity: number;
    AvatarBaseType: Role_T;
    EquipmentName: ExcelNameHash;
    ImagePath: string;
}

export interface ExcelRank {
    IconPath: string;
    SkillAddLevelList: Record<string, number>;
}

export interface NormalizedWeaponMeta extends BaseNormalizedWeaponMeta {
    role: Role_T;
    excel: ExcelWeapon;
}

export interface ExcelRelic {
    Rarity: number;
    Type: string;
    MainAffixGroup: number;
    SubAffixGroup: number;
    Icon: string;
    SetID: number;
}

export interface NormalizedRelicMeta extends BaseNormalizedRelicMeta {
    excel: ExcelRelic;
    set: string;
}

export interface ServerAvatarRelicSubAffix {
    affixId: number;
    cnt: number;
    step?: number;
}

export interface ServerAvatarFlatProp {
    type: string;
    value: number;
}

export interface ServerAvatarRelicFlatData {
    props: readonly ServerAvatarFlatProp[];
    setName: number;
    setId: number;
}

export interface ServerRelicData {
    mainAffixId: number;
    subAffixList: readonly ServerAvatarRelicSubAffix[];
    tid: number;
    type: number;
    level: number;
    _flat: ServerAvatarRelicFlatData;
}

export interface ServerAvatarSkillTree {
    pointId: number;
    level: number;
}

export interface ServerAvatarEquipmentFlatData {
    props: readonly ServerAvatarFlatProp[];
    name: number;
}

export interface ServerWeaponData {
    rank: number;
    tid: number;
    promotion: number;
    level: number;
    _flat: ServerAvatarEquipmentFlatData;
}

export interface ServerAvatarData {
    relicList: readonly ServerRelicData[];
    level: number;
    rank?: number;
    promotion: number;
    skillTreeList: readonly ServerAvatarSkillTree[];
    equipment: ServerWeaponData;
    avatarId: number;
    _assist: boolean;
}

export interface ServerSocialPrivacy {
    displayCollection: boolean;
    displayRecord: boolean;
    displayRecordTeam: boolean;
    displayOnlineStatus: boolean;
    displayDiary: boolean;
}

export interface ServerRecordInfo {
    achievementCount: number;
    bookCount: number;
    avatarCount: number;
    equipmentCount: number;
    musicCount: number;
    relicCount: number;
    challengeInfo: {
        scheduleMaxLevel: number;
    };
    maxRogueChallengeScore: number;
}

export interface ServerSocialDetail {
    worldLevel: number;
    privacySettingInfo: ServerSocialPrivacy;
    headIcon: number;
    signature: string;
    avatarDetailList: readonly ServerAvatarData[];
    platform: string;
    recordInfo: ServerRecordInfo;
    uid: number;
    level: number;
    nickname: string;
    isDisplayAvatar: boolean;
    birthday: number;
    friendCount: number;
}

export interface HSRUIDResponse extends UIDResponse {
    detailInfo: ServerSocialDetail;
}
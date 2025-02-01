import type {
    NormalizedAvatarMeta as BaseNormalizedAvatarMeta,
    NormalizedWeaponMeta as BaseNormalizedWeaponMeta,
    NormalizedRelicMeta as BaseNormalizedRelicMeta,
    NormalizedPlayerInfo as BaseNormalizedPlayerInfo,
} from './base';
import {UIDResponse} from "./models";

export const Element = {
    Elec: 'Elec',
    Ether: 'Ether',
    Fire: 'Fire',
    Ice: 'Ice',
    Physics: 'Physics',
    FireFrost: 'FireFrost',
} as const;

export type Element_T = (typeof Element)[keyof typeof Element];

export const Role = {
    Anomaly: 'Anomaly',
    Attack: 'Attack',
    Defense: 'Defense',
    Stun: 'Stun',
    Support: 'Support',
} as const;

export type Role_T = (typeof Role)[keyof typeof Role];

export const PropType = {
    HpMax_Base: '11101',
    HpMax_Ratio: '11102',
    HpMax_Delta: '11103',

    Atk_Base: '12101',
    Atk_Ratio: '12102',
    Atk_Delta: '12103',

    BreakStun_Base: '12201',
    BreakStun_Ratio: '12202',

    Def_Base: '13101',
    Def_Ratio: '13102',
    Def_Delta: '13103',

    Crit_Base: '20101',
    Crit_Delta: '20103',

    CritDmg_Base: '21101',
    CritDmg_Delta: '21103',

    PenRatio_Base: '23101',
    PenRatio_Delta: '23103',

    PenDelta_Base: '23201',
    PenDelta_Delta: '23203',

    SpRecover_Base: '30501',
    SpRecover_Ratio: '30502',
    SpRecover_Delta: '30503',

    ElementMystery_Base: '31201',
    ElementMystery_Delta: '31203',

    ElementAbnormalPower_Base: '31401',
    ElementAbnormalPower_Ratio: '31402',
    ElementAbnormalPower_Delta: '31403',

    AddedDamageRatio_Physics_Base: '31501',
    AddedDamageRatio_Physics_Delta: '31503',

    AddedDamageRatio_Fire_Base: '31601',
    AddedDamageRatio_Fire_Delta: '31603',

    AddedDamageRatio_Ice_Base: '31701',
    AddedDamageRatio_Ice_Delta: '31703',

    AddedDamageRatio_Elec_Base: '31801',
    AddedDamageRatio_Elec_Delta: '31803',

    AddedDamageRatio_Ether_Base: '31901',
    AddedDamageRatio_Ether_Delta: '31903',
} as const;

export type PropType_T = (typeof PropType)[keyof typeof PropType];

export type Props = {
    [K in PropType_T]?: number;
};

export interface GrowthProps {
    11101: number;
    12101: number;
    13101: number;
}

export interface CoreEnhancementProps {
    11101?: number;
    12101?: number;
    12201?: number;
}

export interface ExcelAvatar {
    Name: string;
    Rarity: number;
    ProfessionType: Role_T;
    ElementTypes: readonly Element_T[];
    Image: string;
    CircleIcon: string;
    BaseProps: Props;
    GrowthProps: GrowthProps;
    PromotionProps: readonly GrowthProps[];
    CoreEnhancementProps: readonly CoreEnhancementProps[];
    Skins: Record<string, { Image: string; CircleIcon: string }>;
    Colors: {
        Accent?: string;
        Mindscape?: string;
    };
}

export interface NormalizedAvatarMeta extends BaseNormalizedAvatarMeta {
    element: Element_T;
    role: Role_T;
    excel: ExcelAvatar;
}

export interface IProperty {
    PropertyValue: number;
    PropertyId: number;
    PropertyLevel?: number;
}

export interface ExcelWeapon {
    ItemName: string;
    Rarity: number;
    ProfessionType: Role_T;
    ImagePath: string;
    MainStat: IProperty;
    SecondaryStat: IProperty;
}

export interface NormalizedWeaponMeta extends BaseNormalizedWeaponMeta {
    role: Role_T;
    excel: ExcelWeapon;
}

export interface ExcelEquipment {
    SuitId: number;
    Rarity: number;
}

export interface ExcelSuit {
    Icon: string;
    Name: string;
    SetBonusProps: Props;
}

export interface ExcelMedal {
    Name: string;
    Icon: string;
    TipNum: string;
}

export interface NormalizedRelicMeta extends BaseNormalizedRelicMeta {
    excel: ExcelEquipment;
    set: ExcelSuit;
}

export interface NormalizedPlayerInfo extends BaseNormalizedPlayerInfo {}

/* server types */

export interface SkillLevelList {
    Index: number;
    Level: number;
}

export interface ServerEquipmentData {
    Uid: number;
    BreakLevel: number;
    IsLocked: boolean;
    Level: number;
    IsAvailable: boolean;
    Id: number;
    Exp: number;

    MainPropertyList: IProperty[];
    RandomPropertyList: IProperty[];
    // IAADINABEFP: boolean;
}

export interface ServerWeaponData {
    BreakLevel: number;
    Uid: number;
    IsAvailable: boolean;
    Level: number;
    Exp: number;
    IsLocked: boolean;
    Id: number;
    UpgradeLevel: number;
}

export interface EquippedList {
    Slot: number;
    Equipment: ServerEquipmentData;
}

export interface ServerAvatarData {
    Id: string;
    Level: number;
    SkillLevelList: SkillLevelList[];
    TalentLevel: number;
    Exp: number;
    ObtainmentTimestamp: number;
    TalentToggles: boolean[];

    PromotionLevel: number;
    CoreSkillEnhancement: number;
    SkinId?: number;

    // WeaponUid: number;

    Weapon: ServerWeaponData;
    EquippedList: EquippedList[];

    WeaponEffectState: number;

    ClaimedRewards: number[];
}

export interface ServerProfileDetail {
    Nickname: string;
    MainAvatarId: number;
    Uid: number;
    Level: number;
    Title: number;
    ProfileId: number;
    CallingCardId: number;
}

export interface ServerMedal {
    MedalIcon: number;
    Value: number;
    MedalType: number;
}

export interface ServerSocialDetail {
    ProfileDetail: ServerProfileDetail;
    Desc: string;
    LastLoginTimestamp: number; // TODO: REMOVE
    MedalList: ServerMedal[];
}

export interface ServerShowcaseDetail {
    WeaponList: ServerWeaponData[];
    AvatarList: ServerAvatarData[];
    EquipmentList: ServerEquipmentData[];
}

export interface ServerPlayerInfo {
    ShowcaseDetail: ServerShowcaseDetail;
    SocialDetail: ServerSocialDetail;
    Desc: string;
    IsOnline: boolean;
    BirthDateMonth: number;
    BirthDateDay: number;
}

export interface ServerShowcaseData {
    PlayerInfo: ServerPlayerInfo;
}

export interface ZZZUIDResponse extends UIDResponse {
    PlayerInfo: ServerPlayerInfo;
}
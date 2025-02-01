import type {
    NormalizedAvatarMeta as BaseNormalizedAvatarMeta,
    NormalizedWeaponMeta as BaseNormalizedWeaponMeta,
    NormalizedRelicMeta as BaseNormalizedRelicMeta,
    NormalizedPlayerInfo as BaseNormalizedPlayerInfo,
} from './base';
import {UIDResponse} from "./models";

export const Element = {
    Elec: 'Elec',
    Fire: 'Fire',
    Ice: 'Ice',
    Physical: 'Physical',
    Rock: 'Rock',
    Water: 'Water',
    Wind: 'Wind',
} as const;

export type Element_T = (typeof Element)[keyof typeof Element];

export const Role = {
    WEAPON_SWORD_ONE_HAND: 'WEAPON_SWORD_ONE_HAND',
    WEAPON_CATALYST: 'WEAPON_CATALYST',
    WEAPON_CLAYMORE: 'WEAPON_CLAYMORE',
    WEAPON_BOW: 'WEAPON_BOW',
    WEAPON_POLE: 'WEAPON_POLE',
} as const;

export type Role_T = (typeof Role)[keyof typeof Role];

export const PropType = {
    FIGHT_PROP_BASE_HP: 1,
    FIGHT_PROP_HP: 2,
    FIGHT_PROP_HP_PERCENT: 3,
    FIGHT_PROP_BASE_ATTACK: 4,
    FIGHT_PROP_ATTACK: 5,
    FIGHT_PROP_ATTACK_PERCENT: 6,
    FIGHT_PROP_BASE_DEFENSE: 7,
    FIGHT_PROP_DEFENSE: 8,
    FIGHT_PROP_DEFENSE_PERCENT: 9,
    FIGHT_PROP_BASE_SPEED: 10,
    FIGHT_PROP_SPEED_PERCENT: 11,
    FIGHT_PROP_HP_MP_PERCENT: 12,
    FIGHT_PROP_ATTACK_MP_PERCENT: 13,
    FIGHT_PROP_CRITICAL: 20,
    FIGHT_PROP_ANTI_CRITICAL: 21,
    FIGHT_PROP_CRITICAL_HURT: 22,
    FIGHT_PROP_CHARGE_EFFICIENCY: 23,
    FIGHT_PROP_ADD_HURT: 24,
    FIGHT_PROP_SUB_HURT: 25,
    FIGHT_PROP_HEAL_ADD: 26,
    FIGHT_PROP_HEALED_ADD: 27,
    FIGHT_PROP_ELEMENT_MASTERY: 28,
    FIGHT_PROP_PHYSICAL_SUB_HURT: 29,
    FIGHT_PROP_PHYSICAL_ADD_HURT: 30,
    FIGHT_PROP_DEFENCE_IGNORE_RATIO: 31,
    FIGHT_PROP_DEFENCE_IGNORE_DELTA: 32,
    FIGHT_PROP_FIRE_ADD_HURT: 40,
    FIGHT_PROP_ELEC_ADD_HURT: 41,
    FIGHT_PROP_WATER_ADD_HURT: 42,
    FIGHT_PROP_GRASS_ADD_HURT: 43,
    FIGHT_PROP_WIND_ADD_HURT: 44,
    FIGHT_PROP_ROCK_ADD_HURT: 45,
    FIGHT_PROP_ICE_ADD_HURT: 46,
    FIGHT_PROP_HIT_HEAD_ADD_HURT: 47,
    FIGHT_PROP_FIRE_SUB_HURT: 50,
    FIGHT_PROP_ELEC_SUB_HURT: 51,
    FIGHT_PROP_WATER_SUB_HURT: 52,
    FIGHT_PROP_GRASS_SUB_HURT: 53,
    FIGHT_PROP_WIND_SUB_HURT: 54,
    FIGHT_PROP_ROCK_SUB_HURT: 55,
    FIGHT_PROP_ICE_SUB_HURT: 56,
    FIGHT_PROP_EFFECT_HIT: 60,
    FIGHT_PROP_EFFECT_RESIST: 61,
    FIGHT_PROP_FREEZE_RESIST: 62,
    FIGHT_PROP_TORPOR_RESIST: 63,
    FIGHT_PROP_DIZZY_RESIST: 64,
    FIGHT_PROP_FREEZE_SHORTEN: 65,
    FIGHT_PROP_TORPOR_SHORTEN: 66,
    FIGHT_PROP_DIZZY_SHORTEN: 67,
    FIGHT_PROP_MAX_FIRE_ENERGY: 70,
    FIGHT_PROP_MAX_ELEC_ENERGY: 71,
    FIGHT_PROP_MAX_WATER_ENERGY: 72,
    FIGHT_PROP_MAX_GRASS_ENERGY: 73,
    FIGHT_PROP_MAX_WIND_ENERGY: 74,
    FIGHT_PROP_MAX_ICE_ENERGY: 75,
    FIGHT_PROP_MAX_ROCK_ENERGY: 76,
    FIGHT_PROP_SKILL_CD_MINUS_RATIO: 80,
    FIGHT_PROP_SHIELD_COST_MINUS_RATIO: 81,
    FIGHT_PROP_CUR_FIRE_ENERGY: 1000,
    FIGHT_PROP_CUR_ELEC_ENERGY: 1001,
    FIGHT_PROP_CUR_WATER_ENERGY: 1002,
    FIGHT_PROP_CUR_GRASS_ENERGY: 1003,
    FIGHT_PROP_CUR_WIND_ENERGY: 1004,
    FIGHT_PROP_CUR_ICE_ENERGY: 1005,
    FIGHT_PROP_CUR_ROCK_ENERGY: 1006,
    FIGHT_PROP_CUR_HP: 1010,
    FIGHT_PROP_MAX_HP: 2000,
    FIGHT_PROP_CUR_ATTACK: 2001,
    FIGHT_PROP_CUR_DEFENSE: 2002,
    FIGHT_PROP_CUR_SPEED: 2003,
    FIGHT_PROP_NONEXTRA_ATTACK: 3000,
    FIGHT_PROP_NONEXTRA_DEFENSE: 3001,
    FIGHT_PROP_NONEXTRA_CRITICAL: 3002,
    FIGHT_PROP_NONEXTRA_ANTI_CRITICAL: 3003,
    FIGHT_PROP_NONEXTRA_CRITICAL_HURT: 3004,
    FIGHT_PROP_NONEXTRA_CHARGE_EFFICIENCY: 3005,
    FIGHT_PROP_NONEXTRA_ELEMENT_MASTERY: 3006,
    FIGHT_PROP_NONEXTRA_PHYSICAL_SUB_HURT: 3007,
    FIGHT_PROP_NONEXTRA_FIRE_ADD_HURT: 3008,
    FIGHT_PROP_NONEXTRA_ELEC_ADD_HURT: 3009,
    FIGHT_PROP_NONEXTRA_WATER_ADD_HURT: 3010,
    FIGHT_PROP_NONEXTRA_GRASS_ADD_HURT: 3011,
    FIGHT_PROP_NONEXTRA_WIND_ADD_HURT: 3012,
    FIGHT_PROP_NONEXTRA_ROCK_ADD_HURT: 3013,
    FIGHT_PROP_NONEXTRA_ICE_ADD_HURT: 3014,
    FIGHT_PROP_NONEXTRA_FIRE_SUB_HURT: 3015,
    FIGHT_PROP_NONEXTRA_ELEC_SUB_HURT: 3016,
    FIGHT_PROP_NONEXTRA_WATER_SUB_HURT: 3017,
    FIGHT_PROP_NONEXTRA_GRASS_SUB_HURT: 3018,
    FIGHT_PROP_NONEXTRA_WIND_SUB_HURT: 3019,
    FIGHT_PROP_NONEXTRA_ROCK_SUB_HURT: 3020,
    FIGHT_PROP_NONEXTRA_ICE_SUB_HURT: 3021,
    FIGHT_PROP_NONEXTRA_SKILL_CD_MINUS_RATIO: 3022,
    FIGHT_PROP_NONEXTRA_SHIELD_COST_MINUS_RATIO: 3023,
    FIGHT_PROP_NONEXTRA_PHYSICAL_ADD_HURT: 3024,
};

export type PropType_T = (typeof PropType)[keyof typeof PropType];

export type Props = {
    [K in PropType_T]?: number;
};

export interface ExcelAvatar {
    Element: Element_T;
    Consts: readonly string[];
    SkillOrder: readonly number[];
    Skills: Record<string, string>;
    ProudMap: Record<string, number>;
    NameTextMapHash: number;
    SideIconName: string;
    QualityType: string;
    WeaponType: Role_T;
    Costumes?: Record<
        string,
        {
            sideIconName: string;
            icon: string;
            art: string;
            avatarId: number;
        }
    >;
}

export interface NormalizedAvatarMeta extends BaseNormalizedAvatarMeta {
    element: Element_T;
    role: Role_T;
    excel: ExcelAvatar;
}

export interface BaseProperty {
    statValue: number;
}

export interface MainProperty extends BaseProperty {
    mainPropId: PropType_T;
}

export interface AppendProperty extends BaseProperty {
    appendPropId: PropType_T;
}

export interface ExcelWeapon {
    nameTextMapHash: string;
    rankLevel: number;
    itemType: 'ITEM_WEAPON';
    icon: string;
    weaponStats: readonly AppendProperty[];
}

export interface NormalizedWeaponMeta extends BaseNormalizedWeaponMeta {
    role: Role_T;
    excel: ExcelWeapon;
}

export const RelicType = {
    EQUIP_BRACER: 0,
    EQUIP_NECKLACE: 1,
    EQUIP_SHOES: 2,
    EQUIP_RING: 3,
    EQUIP_DRESS: 4,
} as const;

export type RelicType_T = (typeof RelicType)[keyof typeof RelicType];

export interface ExcelRelic {
    nameTextMapHash: string;
    rankLevel: number;
    itemType: 'ITEM_RELIQUARY';
    icon: string;
    equipType: RelicType_T;
    setNameTextMapHash: string;
    reliquarySubstats: readonly AppendProperty[];
    reliquaryMainstat: MainProperty;
}

export interface NormalizedRelicMeta extends BaseNormalizedRelicMeta {
    excel: ExcelRelic;
    set: string;
}

export interface NormalizedPlayerInfo extends BaseNormalizedPlayerInfo {}

// server data

export interface ServerRelicData {
    level: number;
    mainPropId: number;
    appendPropIdList: readonly number[];
}

export interface ServerWeaponData {
    level: number;
    promoteLevel: number;
    affixMap: Record<number, number>;
}

export interface ServerPropValue {
    type: number;
    ival: string;
    fval?: string;
    val?: string;
}

export interface ServerEquip {
    itemId: number;
}

export interface ServerRelicEquip extends ServerEquip {
    reliquary: ServerRelicData;
    flat: ExcelRelic;
}

export interface ServerWeaponEquip extends ServerEquip {
    weapon: ServerWeaponData;
    flat: ExcelWeapon;
}

export interface ServerAvatarData {
    avatarId: number;
    propMap: Record<number, ServerPropValue>;
    talentIdList?: readonly number[];
    fightPropMap: Record<number, number>;
    skillDepotId: number;
    inherentProudSkillList: readonly number[];
    skillLevelMap: Record<number, number>;
    proudSkillExtraLevelMap: Record<number, number>;
    equipList: readonly (ServerRelicEquip | ServerWeaponEquip)[];
    costumeId: number;
}

export interface ServerSocialAvatarDetail {
    avatarId: number;
    level: number;
    costumeId: number;
    talentLevel: number;
    energyType: number;
}

export interface Birthday {
    month: number;
    day: number;
}

export const ServerOnlineState = {
    FRIEND_ONLINE_STATE_DISCONNECT: 0,
    FRIEND_ONLINE_STATE_ONLINE: 1,
} as const;

export type ServerOnlineState_T = (typeof ServerOnlineState)[keyof typeof ServerOnlineState];

export const ServerFriendEnterHomeOption = {
    FRIEND_ENTER_HOME_OPTION_NEED_CONFIRM: 0,
    FRIEND_ENTER_HOME_OPTION_REFUSE: 1,
    FRIEND_ENTER_HOME_OPTION_DIRECT: 2,
} as const;

export type ServerFriendEnterHomeOption_T = (typeof ServerFriendEnterHomeOption)[keyof typeof ServerFriendEnterHomeOption];

export interface ServerProfilePicture {
    avatarId: number;
    costumeId: number;
    id: number;
}

export interface ServerTowerDetail {
    towerFloorIndex: number;
    towerLevelIndex: number;
    towerStarIndex: number;
}

export interface ServerTheaterDetail {
    theaterActIndex: number;
    theaterModeIndex: number;
    theaterStarIndex: number;
}

export interface ServerAchievementDetail {
    finishAchievementNum: number;
}

export interface ServerSocialDetail extends ServerTheaterDetail, ServerTowerDetail, ServerAchievementDetail {
    uid: number;
    nickname: string;
    level: number;
    avatarId: number;
    signature: string;
    birthday: Birthday;
    worldLevel: number;
    reservedList: readonly number[];
    onlineState: ServerOnlineState_T;
    param: number;
    isFriend: boolean;
    isMpModeAvailable: boolean;
    onlineId: string;
    nameCardId: number;
    isInBlacklist: boolean;
    isChatNoDisturb: boolean;
    remarkName: string;
    isShowAvatar: boolean;
    showAvatarInfoList: readonly ServerSocialAvatarDetail[];
    showNameCardIdList: readonly number[];
    friendEnterHomeOption: ServerFriendEnterHomeOption_T;
    profilePicture: ServerProfilePicture;
    ipCode: string;
    isShowAvatarTalent: boolean;
    fetterCount: number;
}

export interface GIUIDResponse extends UIDResponse {
    playerInfo: ServerSocialDetail;
    avatarInfoList: readonly ServerAvatarData[];
}
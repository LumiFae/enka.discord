import type { ServerAvatarData as GIServerAvatarData } from './gi';
import type { ServerAvatarData as HSRServerAvatarData } from './hsr';
import type { ServerAvatarData as ZZZServerAvatarData } from './zzz';

export const HoyoType = {
    GI: 0,
    HSR: 1,
    ZZZ: 2,
} as const;

export type HoyoType_T = (typeof HoyoType)[keyof typeof HoyoType];

export interface DjUser {
    id: number;
}

export interface DjProfile {
    signup_state: number;
    bio: string;
    level: number;
    avatar?: string;
    image_url: string;
}

export interface DjHoyoProfile {
    id: number;
    hash: string | null;
    user: DjUser;
    uid: number;
    verified: boolean;
    public: boolean;
    uid_public: boolean;
    live_public: boolean;
    player_info: any | null;
    verification_code: string | null;
    verification_expire: string | null;
    verification_code_retries: number;
    avatar_order: Record<number, number> | null;
    hoyo_type: HoyoType_T;
    order: number;
    region: string;
}

export interface BuildSettings {}

export interface DjBuild {
    id: number;
    hoyo_profile: DjHoyoProfile;
    name: string;
    avatar_id: string;
    avatar_data: GIServerAvatarData | HSRServerAvatarData | ZZZServerAvatarData;
    live: boolean;
    hidden: boolean;
    settings: BuildSettings; // Consider creating a specific type for settings
    public: boolean;
    order: number; // For OrderedModel functionality
    image?: string; // URL to the image
    image_hash: string;
    hoyo_type: HoyoType_T;
    changed_at: string; // ISO date string
}

export interface UIDOwner {
    id: number;
    hash: string;
    username: string;
    profile: DjProfile;
}

export interface UIDResponse {
    uid: string;
    ttl: number;
    owner: UIDOwner;
}
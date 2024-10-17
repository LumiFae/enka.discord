export type ProfileInfo = {
    username: string;
    profile: {
        bio: string;
        level: number;
        signup_state: number;
        avatar: string;
        image_url: string;
    };
    id: number;
}

export type NoProfile = {
    detail: "Not found."
}

type HoyoPlayerInfoBase = {
    nickname: string;
    [k: string]: unknown;
};

type HoyoPlayerInfo<T extends 0 | 1> = T extends 0
    ? HoyoPlayerInfoBase & { profilePicture: { id: number } }
    : HoyoPlayerInfoBase & { headIcon: number };

export type Hoyo = {
    hoyo_type: 0 | 1;
    player_info: HoyoPlayerInfo<0 | 1>;
    uid: string;
    hash: string;
    avatar_order: Record<number, number> | null;
    [k: string]: unknown;
};

export type HoyosRecord = Record<string, Hoyo>;

export type HoyoCharacterBuild = {
    id: number;
    name: string;
    avatar_id: number;
    [k: string]: unknown;
    hoyo_type: 0 | 1;
}

export type HoyoCharacterBuilds = HoyoCharacterBuild[];

export type HoyoCharacters = Record<string, HoyoCharacterBuilds>;
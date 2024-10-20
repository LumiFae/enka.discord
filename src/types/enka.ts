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
};

type HoyoPlayerInfo<T extends 0 | 1> = T extends 0
    ? HoyoPlayerInfoBase &
    {
        profilePicture: {
            id: number
        };
        showAvatarInfoList?: {
            level: number;
            avatarId: number;
        }[]
    }
    : HoyoPlayerInfoBase &
    {
        headIcon: number;
        avatarDetailList?: {
            level: number;
            avatarId: number;
        }[]
    };

export type Hoyo = {
    hoyo_type: 0 | 1;
    player_info: HoyoPlayerInfo<0 | 1>;
    uid: string;
    hash: string;
    avatar_order: Record<number, number> | null;
};

export type HoyosRecord = Record<string, Hoyo>;

export type HoyoCharacterBuild = {
    id: number;
    name: string;
    avatar_id: number;
    hoyo_type: 0 | 1;
}

export type HoyoCharacterBuilds = HoyoCharacterBuild[];

export type HoyoCharacters = Record<string, HoyoCharacterBuilds>;

export type GIUIDLookup = {
    playerInfo: {
        nickname: string;
        showAvatarInfoList: {
            avatarId: number;
            level: number;
            energyType: number;
        }[];
    };
    avatarInfoList: {
        avatarId: number;
    }[];
    uid: string;
}

export type HSRUIDAPILookup = {
    detailInfo: {
        uid: number;
    }
    uid: string;
}

export type HSRUIDLookup = {
    detailInfo: {
        uid: number;
        nickname: string;
        avatarDetailList: {
            avatarId: number;
        }[];
    }
    uid: string;
}
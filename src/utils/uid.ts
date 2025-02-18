import Character from "./character";
import {HoyoType, HoyoType_T} from "../types/models";
import {GIUIDResponse} from "../types/gi";
import {HSRUIDResponse} from "../types/hsr";
import {ZZZUIDResponse} from "../types/zzz";
import {getCharacter} from "./misc";
import Locales from "./locales";

type UIDResponse = GIUIDResponse | HSRUIDResponse | ZZZUIDResponse

export default class UID {
    nickname: string;
    avatars: Character[];
    data: UIDResponse;
    hoyo_type: HoyoType_T;

    constructor(hoyo_type: HoyoType_T, data: UIDResponse, locale: Locales) {
        this.data = data;
        this.hoyo_type = hoyo_type;

        switch(hoyo_type) {
            case HoyoType.GI: {
                const giData = data as GIUIDResponse;
                this.avatars = giData.avatarInfoList.map((avatar) => getCharacter(locale, this.hoyo_type, String(avatar.avatarId)));
                this.nickname = giData.playerInfo.nickname;
                break;
            }
            case HoyoType.HSR: {
                const hsrData = data as HSRUIDResponse
                this.avatars = hsrData.detailInfo.avatarDetailList.map((avatar) => getCharacter(locale, this.hoyo_type, String(avatar.avatarId)));
                this.nickname = hsrData.detailInfo.nickname;
                break;
            }
            case HoyoType.ZZZ: {
                const zzzData = data as ZZZUIDResponse;
                this.avatars = zzzData.PlayerInfo.ShowcaseDetail.AvatarList.map((avatar) => getCharacter(locale, this.hoyo_type, String(avatar.Id)));
                this.nickname = zzzData.PlayerInfo.SocialDetail.ProfileDetail.Nickname;
                break;
            }
        }
    }

    getCharacter(id: string) {
        return this.avatars.find(avatar => avatar.id === id);
    }
}
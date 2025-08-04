import {DjHoyoProfile} from "../types/models";
import {getFromType} from "./misc";

export default class Hoyo {
    public name: string;
    public gameName: string;

    constructor(public data: DjHoyoProfile) {
        this.name = 'nickname' in this.data.player_info ? this.data.player_info.nickname : this.data.player_info.ProfileDetail.Nickname;
        this.gameName = getFromType(this.data.hoyo_type, "Genshin Impact", "Honkai: Star Rail", "Zenless Zone Zero");
    }

    get hash() {
        return this.data.hash;
    }
}
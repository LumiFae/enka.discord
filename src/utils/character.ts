import { default as giLocs } from "../resources/gi/locs";
import { default as hsrLocs } from "../resources/hsr/locs";
import { default as zzzLocs } from "../resources/zzz/locs";
import { default as giChars } from "../resources/gi/characters";
import { default as hsrChars } from "../resources/hsr/characters";
import { default as zzzChars } from "../resources/zzz/characters";
import {ExcelAvatar as GIExcelAvatar} from "../types/gi";
import {ExcelAvatar as HSRExcelAvatar} from "../types/hsr";
import {ExcelAvatar as ZZZExcelAvatar} from "../types/zzz";
import {HoyoType, HoyoType_T} from "../types/models";
import {colors, emojiIds, getLocale} from "./misc";
import {ColorResolvable} from "discord.js";

type ExcelAvatars = GIExcelAvatar | HSRExcelAvatar | ZZZExcelAvatar;

export default class Character {
    hoyo_type: HoyoType_T;
    data: ExcelAvatars;
    id: string;
    hash: string | number;
    name: string;
    element: string;
    emojiFromElement: string;
    colorFromElement: ColorResolvable;

    constructor(hoyo_type: HoyoType_T, data: ExcelAvatars, id: string) {
        this.data = data;
        this.hoyo_type = hoyo_type;
        this.id = id;

        switch (hoyo_type) {
            case HoyoType.GI:
                const giAvatar = this.data as GIExcelAvatar;
                this.hash = giAvatar.NameTextMapHash;
                this.element = giAvatar.Element;
                this.emojiFromElement = emojiIds[`GI${this.element}`]
                this.colorFromElement = colors[`GI${this.element}`]
                break;

            case HoyoType.HSR:
                const hsrAvatar = this.data as HSRExcelAvatar;
                this.hash = hsrAvatar.AvatarName.Hash;
                this.element = hsrAvatar.Element;
                this.emojiFromElement = emojiIds[`HSR${this.element}`]
                this.colorFromElement = colors[`HSR${this.element}`]
                break;

            case HoyoType.ZZZ:
                const zzzAvatar = this.data as ZZZExcelAvatar;
                this.hash = zzzAvatar.Name;
                this.element = zzzAvatar.ElementTypes[0];
                this.emojiFromElement = emojiIds[`ZZZ${this.element}`]
                this.colorFromElement = colors[`ZZZ${this.element}`]
                break;
        }

        this.name = getLocale(this.hoyo_type, this.hash);
    }
}
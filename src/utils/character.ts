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

interface ICharacter {
    data: ExcelAvatars;
    hash: string | number;
    element: string;
    emojiFromElement: string;
    colorFromElement: ColorResolvable;
}

class GICharacter implements ICharacter {
    emojiFromElement: string;
    colorFromElement: ColorResolvable;

    constructor(public data: GIExcelAvatar) {
        this.emojiFromElement = emojiIds[`GI${this.element}`];
        this.colorFromElement = colors[`GI${this.element}`];
    }

    get element() {
        return this.data.Element;
    }

    get hash() {
        return this.data.NameTextMapHash;
    }
}

class HSRCharacter implements ICharacter {
    emojiFromElement: string;
    colorFromElement: ColorResolvable;

    constructor(public data: HSRExcelAvatar) {
        this.emojiFromElement = emojiIds[`HSR${this.element}`];
        this.colorFromElement = colors[`HSR${this.element}`] as ColorResolvable;
    }

    get element() {
        return this.data.Element;
    }

    get hash() {
        return this.data.AvatarName.Hash;
    }
}

class ZZZCharacter implements ICharacter {
    emojiFromElement: string;
    colorFromElement: ColorResolvable;

    constructor(public data: ZZZExcelAvatar) {
        this.emojiFromElement = emojiIds[`ZZZ${this.element}`];
        this.colorFromElement = colors[`ZZZ${this.element}`] as ColorResolvable;
    }

    get element() {
        return this.data.ElementTypes[0];
    }

    get hash() {
        return this.data.Name;
    }
}

export default class Character {
    hoyo_type: HoyoType_T;
    data: ExcelAvatars;
    id: string;
    name: string;
    character: ICharacter;

    constructor(hoyo_type: HoyoType_T, data: ExcelAvatars, id: string) {
        this.data = data;
        this.hoyo_type = hoyo_type;
        this.id = id;

        switch (hoyo_type) {
            case HoyoType.GI:
                const giAvatar = this.data as GIExcelAvatar;
                this.character = new GICharacter(giAvatar);
                break;

            case HoyoType.HSR:
                const hsrAvatar = this.data as HSRExcelAvatar;
                this.character = new HSRCharacter(hsrAvatar);
                break;

            case HoyoType.ZZZ:
                const zzzAvatar = this.data as ZZZExcelAvatar;
                this.character = new ZZZCharacter(zzzAvatar);
                break;
        }

        this.name = getLocale(this.hoyo_type, this.hash);
    }

    get element() {
        return this.character.element;
    }

    get hash() {
        return this.character.hash;
    }

    get emojiFromElement() {
        return this.character.emojiFromElement;
    }

    get colorFromElement() {
        return this.character.colorFromElement;
    }
}
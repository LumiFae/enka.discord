import {ExcelAvatar as GIExcelAvatar} from "../types/gi";
import {ExcelAvatar as HSRExcelAvatar} from "../types/hsr";
import {ExcelAvatar as ZZZExcelAvatar} from "../types/zzz";
import {HoyoType, HoyoType_T} from "../types/models";
import {colors, emojiIds, getLocale} from "./misc";
import {ColorResolvable} from "discord.js";
import Locales from "./locales";


type ExcelAvatars = GIExcelAvatar | HSRExcelAvatar | ZZZExcelAvatar;

const games = {
    0: "GI",
    1: "HSR",
    2: "ZZZ"
}

abstract class BaseCharacter<T extends ExcelAvatars> {
    constructor(public data: T, private hoyoType: HoyoType_T) {}

    abstract get element(): string;
    abstract get hash(): string | number;

    get emojiFromElement(): string {
        return emojiIds[`${games[this.hoyoType]}${this.element}`];
    }

    get colorFromElement(): ColorResolvable {
        return colors[`${games[this.hoyoType]}${this.element}`];
    }
}

class GICharacter extends BaseCharacter<GIExcelAvatar> {
    get element() {
        return this.data.Element;
    }

    get hash() {
        return this.data.NameTextMapHash;
    }
}

class HSRCharacter extends BaseCharacter<HSRExcelAvatar> {
    get element() {
        return this.data.Element;
    }

    get hash() {
        return this.data.AvatarName.Hash;
    }
}

class ZZZCharacter extends BaseCharacter<ZZZExcelAvatar>{
    get element() {
        return this.data.ElementTypes[0];
    }

    get hash() {
        return this.data.Name;
    }
}

export default class Character {
    private character: BaseCharacter<ExcelAvatars>;

    constructor(
        public hoyo_type: HoyoType_T,
        public data: ExcelAvatars,
        public id: string,
        locale: Locales
    ) {
        this.character = this.createCharacter();
        this.name = getLocale(locale, this.hoyo_type, this.hash)
    }

    private createCharacter(): BaseCharacter<ExcelAvatars> {
        switch (this.hoyo_type) {
            case HoyoType.GI:
                return new GICharacter(this.data as GIExcelAvatar, this.hoyo_type);
            case HoyoType.HSR:
                return new HSRCharacter(this.data as HSRExcelAvatar, this.hoyo_type);
            case HoyoType.ZZZ:
                return new ZZZCharacter(this.data as ZZZExcelAvatar, this.hoyo_type);
        }
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

    name: string;
}
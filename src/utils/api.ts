import axios, {AxiosResponse} from "axios";
import {
    GIUIDLookup,
    HoyoCharacters,
    HoyosRecord,
    HSRUIDAPILookup,
    HSRUIDLookup,
    NoProfile,
    ProfileInfo, ZZZUIDLookup
} from "../types/enka";

export const hoyo_type = {
    Genshin: 0,
    Honkai: 1,
    Zenless: 2
} as const;

export type HoyoType = typeof hoyo_type[keyof typeof hoyo_type];

export async function get<T>(url: string) {
    return await axios.get<T>(url, { headers: { "User-Agent": "enka.discord" } });
}

export async function getBuffer(url: string) {
    return await axios.get(url, { responseType: "arraybuffer" }).then((response) => Buffer.from(response.data));
}

type LookupType<T extends HoyoType> = T extends 0 ? GIUIDLookup : T extends 1 ? HSRUIDAPILookup | HSRUIDLookup : ZZZUIDLookup;

type UIDExists<T extends HoyoType> = T extends 0 ? GIUIDLookup : T extends 1 ? HSRUIDLookup : ZZZUIDLookup;

class EnkaAPI {
    checkInvalid(profile: AxiosResponse<NoProfile | ProfileInfo | HoyosRecord | HoyoCharacters, any> | null) {
        return !profile || ('detail' in profile.data && profile.data.detail === "Not found.");
    }

    async profile(name: string) {
        const call = await get<ProfileInfo | NoProfile>(`https://enka.network/api/profile/${name}/?format=json`).catch(() => null);
        if(this.checkInvalid(call)) return null;
        return call;
    }

    async hoyos(name: string) {
        const call = await get<NoProfile | HoyosRecord>(`https://enka.network/api/profile/${name}/hoyos/?format=json`).catch(() => null);
        if(this.checkInvalid(call)) return null;
        return call;
    }

    async hoyosBuilds(name: string, hash: string) {
        const call = await get<NoProfile | HoyoCharacters>(`https://enka.network/api/profile/${name}/hoyos/${hash}/builds/?format=json`).catch(() => null);
        if(this.checkInvalid(call)) return null;
        return call;
    }

    async uid(uid: string, hoyoType: HoyoType): Promise<AxiosResponse<UIDExists<typeof hoyoType>, any> | null> {
        const call = await get<LookupType<typeof hoyoType>>(
            `https://enka.network/api/${hoyoType === hoyo_type.Genshin ? "" : hoyoType === hoyo_type.Honkai ? "hsr/" : "zzz/"}uid/${uid}?format=json`
        ).catch(() => null);
        if(!call || ('detailInfo' in call.data && !('nickname' in call.data.detailInfo))) return null;
        return call as AxiosResponse<UIDExists<typeof hoyoType>, any>;
    }
}

export const api = new EnkaAPI();

let giCharacters: {
    lastUpdated: number;
    characters: Characters[];
}

let hsrCharacters: {
    lastUpdated: number;
    characters: Characters[];
}

let zzzCharacters: {
    lastUpdated: number;
    characters: Characters[];
}

class GameCharacters {
    private async generateCharacters(hoyoType: HoyoType) {
        if(hoyoType === hoyo_type.Genshin) {
            giCharacters = {
                lastUpdated: Date.now(),
                characters: await getGICharacters()
            }
        } else if (hoyoType === hoyo_type.Honkai) {
            hsrCharacters = {
                lastUpdated: Date.now(),
                characters: await getHSRCharacters()
            }
        } else {
            zzzCharacters = {
                lastUpdated: Date.now(),
                characters: await getZZZCharacters()
            }
        }
    }

    async getCharacters(hoyoType: HoyoType){
        if(hoyoType === hoyo_type.Genshin) {
            if(!giCharacters || Date.now() - giCharacters.lastUpdated > 1000 * 60 * 60) {
                await this.generateCharacters(hoyo_type.Genshin);
            }
            return giCharacters.characters;
        } else if (hoyoType === hoyo_type.Honkai) {
            if(!hsrCharacters || Date.now() - hsrCharacters.lastUpdated > 1000 * 60 * 60) {
                await this.generateCharacters(hoyo_type.Honkai);
            }
            return hsrCharacters.characters;
        } else {
            if(!zzzCharacters || Date.now() - zzzCharacters.lastUpdated > 1000 * 60 * 60) {
                await this.generateCharacters(hoyo_type.Zenless);
            }
            return zzzCharacters.characters;
        }
    }

    async getCharacterById(hoyo_type: HoyoType, id: string){
        const characters = await this.getCharacters(hoyo_type);
        return characters.find(character => character.characterId === id);
    }
}

export const characters = new GameCharacters();


type GICharactersAPI = Record<
    string,
    {
        [k: string]: unknown;
        NameTextMapHash: number;
        Element: string;
    }
>;

export type Characters = {
    name: string;
    characterId: string;
    nameHash: number | string;
    element: string;
};

export async function getGICharacters() {
    const locales = await getGILocales();
    const response = await axios.get(
        'https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/characters.json',
    );
    const data: GICharactersAPI = response.data;
    const returndata: Characters[] = [];
    const localedata = locales['en'];
    for (const [key, value] of Object.entries(data)) {
        const name = localedata[value.NameTextMapHash];
        returndata.push({
            name,
            characterId: key,
            nameHash: value.NameTextMapHash,
            element: value.Element,
        });
    }
    return returndata;
}

async function getGILocales(): Promise<Record<string, Record<string, string>>> {
    const response = await axios.get(
        'https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/loc.json',
    );
    return response.data;
}

async function getHSRLocales(): Promise<
    Record<string, Record<string, string>>
> {
    const response = await axios.get(
        'https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/hsr/hsr.json',
    );
    return response.data;
}

type HSRCharactersAPI = Record<
    string,
    {
        [k: string]: unknown;
        AvatarName: {
            Hash: number;
        };
        Element: string;
    }
>;

export async function getHSRCharacters() {
    const locales = await getHSRLocales();
    const response = await axios.get(
        'https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/hsr/honker_characters.json',
    );
    const data: HSRCharactersAPI = response.data;
    const returndata: Characters[] = [];
    const localedata = locales['en'];
    for (const [key, value] of Object.entries(data)) {
        const name = localedata[value.AvatarName.Hash];
        returndata.push({
            name,
            characterId: key,
            nameHash: value.AvatarName.Hash,
            element: value.Element,
        });
    }
    return returndata;
}

type ZZZCharactersAPI = Record<string,
    {
        Name: string;
        ElementTypes: readonly string[];
    }>

export async function getZZZLocales() {
    const response = await axios.get<Record<string, Record<string, string>>>(
        'https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/locs.json',
    );
    return response.data;
}

export async function getZZZCharacters() {
    const locales = await getZZZLocales();
    const response = await axios.get<ZZZCharactersAPI>(
        'https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/avatars.json'
    )
    const data = response.data;
    const returnData: Characters[] = [];
    const localeData = locales['en'];
    for(const [key, value] of Object.entries(data)) {
        const name = localeData[value.Name];
        returnData.push({
            name,
            characterId: key,
            nameHash: value.Name,
            element: value.ElementTypes[0]
        })
    }
    return returnData;
}
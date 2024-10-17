import axios, {AxiosResponse} from "axios";
import {HoyoCharacters, HoyosRecord, NoProfile, ProfileInfo} from "../types/enka";

export async function get<T>(url: string) {
    return await axios.get<T>(url, { headers: { "User-Agent": "enka.discord" } });
}

export async function getBuffer(url: string) {
    return await axios.get(url, { responseType: "arraybuffer" }).then((response) => Buffer.from(response.data));
}

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
}

export const api = new EnkaAPI();


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
    nameHash: number;
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
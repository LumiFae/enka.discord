import axios, {AxiosResponse} from "axios";
import {DjBuild, DjHoyoProfile, HoyoType_T, UIDOwner} from "../types/models";
import {ExpireMap, getFromType, minuteInMillis} from "./misc";
import {GIUIDResponse} from "../types/gi";
import {HSRUIDResponse} from "../types/hsr";
import {ZZZUIDResponse} from "../types/zzz";
import UID from "./uid";
import Locales from "./locales";
import Hoyo from "./hoyo";

export type NoProfile = {
    detail: "Not found."
}

export default class API {
    private static isNotValid(response: AxiosResponse<any> | null): response is AxiosResponse<NoProfile> | null {
        if(!response) return true;
        if(response.status !== 200) return true;
        return !!response.data.detail;
    }
    static async hoyos(name: string) {
        if(hoyosMap.has(name)) return hoyosMap.get(name)!;
        const req = await axios.get<NoProfile | Record<string, DjHoyoProfile>>(`https://enka.network/api/profile/${name}/hoyos/?format=json`).catch(() => null)
        if(this.isNotValid(req)) return null;
        const ret = Object.values(req.data).map(x => new Hoyo(x));
        hoyosMap.set(name, ret);
        return ret;
    }

    static async hoyo(name: string, hoyo: string) {
        if(hoyosMap.get(name)?.[hoyo]) return hoyosMap.get(name)![hoyo]!;
        const req = await axios.get<NoProfile | DjHoyoProfile>(`https://enka.network/api/profile/${name}/hoyos/${hoyo}/?format=json`)
        if(this.isNotValid(req)) return null;
        return new Hoyo(req.data as DjHoyoProfile);
    }

    static async builds(name: string, hoyo: string) {
        if(buildsMap.has(hoyo)) return buildsMap.get(hoyo)!;
        type Builds = Record<string, DjBuild[]>
        const req = await axios.get<NoProfile | Builds>(`https://enka.network/api/profile/${name}/hoyos/${hoyo}/builds/?format=json`).catch(() => null)
        if(this.isNotValid(req)) return null;
        buildsMap.set(hoyo, req.data as Builds);
        return req.data as Builds;
    }

    static async character(name: string, hoyo: string, charId: string) {
        const builds = await API.builds(name, hoyo);
        if(!builds || !builds[charId]) return null;
        return builds[charId];
    }

    static async build(name: string, hoyo: string, charId: string, buildId: string) {
        const character = await API.character(name, hoyo, charId);
        const build = character?.find(build => String(build.id) === buildId);
        if(!character || !build) return null;
        return build;
    }

    static async uid(hoyo_type: HoyoType_T, uid: string, locale: Locales) {
        if(uidMap.has(uid)) return uidMap.get(uid)!;
        type UIDResponse = GIUIDResponse | HSRUIDResponse | ZZZUIDResponse;
        const req = await axios.get<NoProfile | UIDResponse>(`https://enka.network/api${getFromType(hoyo_type, "/", "/hsr/", "/zzz/")}uid/${uid}`).catch(() => null)
        if(this.isNotValid(req)) return null;
        const ret = new UID(hoyo_type, req.data as UIDResponse, locale);
        uidMap.set(uid, ret);
        return ret;
    }

    static async profile(name: string) {
        const req = await axios.get<NoProfile | UIDOwner>(`https://enka.network/api/profile/${name}/?format=json`).catch(() => null)
        if(this.isNotValid(req)) return null;
        return req.data as UIDOwner;
    }
}

const hoyosMap = new ExpireMap<Hoyo[]>(minuteInMillis*5);
const buildsMap = new ExpireMap<Record<string, DjBuild[]>>(minuteInMillis*5);
const uidMap = new ExpireMap<UID>(minuteInMillis*5);
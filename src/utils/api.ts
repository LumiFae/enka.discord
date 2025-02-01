import axios, {AxiosResponse} from "axios";
import {DjBuild, DjHoyoProfile, HoyoType_T, UIDOwner} from "../types/models";
import {getFromType} from "./misc";
import {GIUIDResponse} from "../types/gi";
import {HSRUIDResponse} from "../types/hsr";
import {ZZZUIDResponse} from "../types/zzz";
import UID from "./uid";

export type NoProfile = {
    detail: "Not found."
}

export default class API {
    private static isNotValid(response: AxiosResponse<any>): response is AxiosResponse<NoProfile> {
        if(response.status !== 200) return true;
        return !!response.data.detail;
    }
    static async hoyos(name: string) {
        type Hoyos = Record<string, DjHoyoProfile>
        const req = await axios.get<NoProfile | Hoyos>(`https://enka.network/api/profile/${name}/hoyos/?format=json`)
        if(this.isNotValid(req)) return null;
        return req.data as Hoyos;
    }

    static async hoyo(name: string, hoyo: string) {
        const req = await axios.get<NoProfile | DjHoyoProfile>(`https://enka.network/api/profile/${name}/hoyos/${hoyo}/?format=json`)
        if(this.isNotValid(req)) return null;
        return req.data as DjHoyoProfile;
    }

    static async builds(name: string, hoyo: string) {
        type Builds = Record<string, DjBuild[]>
        const req = await axios.get<NoProfile | Builds>(`https://enka.network/api/profile/${name}/hoyos/${hoyo}/builds/?format=json`)
        if(this.isNotValid(req)) return null;
        return req.data as Builds;
    }

    static async uid(hoyo_type: HoyoType_T, uid: string) {
        type UIDResponse = GIUIDResponse | HSRUIDResponse | ZZZUIDResponse;
        const req = await axios.get<NoProfile | UIDResponse>(`https://enka.network/api${getFromType(hoyo_type, "/", "/hsr/", "/zzz/")}uid/${uid}`)
        if(this.isNotValid(req)) return null;
        return new UID(hoyo_type, req.data as UIDResponse);
    }

    static async profile(name: string) {
        const req = await axios.get<NoProfile | UIDOwner>(`https://enka.network/api/profile/${name}/?format=json`)
        if(this.isNotValid(req)) return null;
        return req.data as UIDOwner;
    }
}
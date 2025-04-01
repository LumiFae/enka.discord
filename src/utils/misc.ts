import {HoyoType, HoyoType_T} from "../types/models";
import { default as giLocs } from "../resources/gi/locs";
import { default as hsrLocs } from "../resources/hsr/locs";
import { default as zzzLocs } from "../resources/zzz/locs";
import { default as giChars } from "../resources/gi/characters";
import { default as hsrChars } from "../resources/hsr/characters";
import { default as zzzChars } from "../resources/zzz/characters";
import {ExcelAvatar as GIExcelAvatar} from "../types/gi";
import {ExcelAvatar as HSRExcelAvatar} from "../types/hsr";
import {ExcelAvatar as ZZZExcelAvatar} from "../types/zzz";
import Character from "./character";
import {
    ActionRow,
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonInteraction,
    MessageActionRowComponent,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuComponent,
    APIActionRowComponent,
    APIStringSelectComponent,
    ComponentType,
    StringSelectMenuInteraction
} from "discord.js";
import axios from "axios";
import Locales from "./locales";


export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function generateRandomCapitalString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const emojiIds: Record<string, string> = {
    "GIElectric": "1296433521564454972",
    "GIFire": "1296433519903375400",
    "GIGrass": "1296433518707998771",
    "GIIce": "1296433516250140726",
    "GIRock": "1296433515277058069",
    "GIWater": "1296433513955856405",
    "GIWind": "1296433512391508028",

    "HSRFire": "1296433551029305404",
    "HSRIce": "1296433552308834324",
    "HSRImaginary": "1296433558193180672",
    "HSRPhysical": "1296433549792247882",
    "HSRQuantum": "1296433556893204580",
    "HSRThunder": "1296433553923375135",
    "HSRWind": "1296433555022282883",

    "ZZZElec": "1334191977440350248",
    "ZZZEther": "1334191978648436898",
    "ZZZFire": "1334191979982094356",
    "ZZZIce": "1334191982754529301",
    "ZZZPhysics": "1334191984239312987",
    "ZZZFireFrost": "1334191981144051832",
};

export const colors = {
    "GIElectric": "#d376f0",
    "GIFire": "#e2311d",
    "GIGrass": "#7bb42d",
    "GIIce": "#98c8e8",
    "GIRock": "#cfa726",
    "GIWater": "#1c72fd",
    "GIWind": "#33ccb3",

    "HSRFire": "#ee473d",
    "HSRIce": "#2692d3",
    "HSRImaginary": "#f3e137",
    "HSRPhysical": "#979797",
    "HSRQuantum": "#6057c9",
    "HSRThunder": "#c65ade",
    "HSRWind": "#61cf93",

    "ZZZElec": "#2eb6ff",
    "ZZZEther": "#fe437e",
    "ZZZFire": "#ff5521",
    "ZZZIce": "#98eff0",
    "ZZZPhysics": "#f0d12b",
    "ZZZFireFrost": "#98eff0",
}

export function getFromType<T>(type: HoyoType_T, ...params: T[]) {
    return params[type];
}

export function getLocale(locale: Locales, type: HoyoType_T, getter: string | number): string {
    if(typeof getter === "number") getter = getter.toString();
    switch (type) {
        case HoyoType.GI:
            return giLocs[locale.locale][getter];
        case HoyoType.HSR:
            return hsrLocs[locale.locale][getter];
        case HoyoType.ZZZ:
            return zzzLocs[locale.locale][getter];
    }
}

export function getCharacter(locale: Locales, type: HoyoType_T, getter: string) {
    switch (type) {
        case HoyoType.GI:
            return new Character(type, giChars[getter], getter, locale);
        case HoyoType.HSR:
            return new Character(type, hsrChars[getter], getter, locale);
        default:
            return new Character(type, zzzChars[getter], getter, locale);
    }
}

export function sameUser(interaction: AnySelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction) {
    return interaction.user.id === interaction.message?.interactionMetadata?.user.id
}

export function setDefault(
    rows: ActionRow<MessageActionRowComponent>[],
    lastValue: string
): ActionRowBuilder<StringSelectMenuBuilder>[] {
    if (rows.length === 0) {
        return [];
    }

    const previousRows = rows.slice(0, -1).map(row => {
        const selectMenu = row.components[0];
        if (selectMenu.type !== ComponentType.StringSelect) {
            return null;
        }

        return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            new StringSelectMenuBuilder(selectMenu.data)
                .setOptions(selectMenu.data.options)
        );
    }).filter((row): row is ActionRowBuilder<StringSelectMenuBuilder> => row !== null);

    const lastRow = rows[rows.length - 1];
    const lastSelectMenu = lastRow.components[0] as StringSelectMenuComponent;
    const newSelectMenu = StringSelectMenuBuilder.from(lastSelectMenu);

    const options = [...newSelectMenu.options];
    const defaultOptionIndex = options.findIndex(opt => opt.data.value === lastValue);

    if (defaultOptionIndex !== -1) {
        const existingDefaultOption = options.findIndex(opt => !!opt.data.default)
        if (existingDefaultOption !== -1) {
            options[existingDefaultOption] = options[existingDefaultOption].setDefault(false);
        }
        options[defaultOptionIndex] = options[defaultOptionIndex].setDefault(true);
        newSelectMenu.setOptions(options);
    }

    const lastRowBuilder = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(newSelectMenu);

    return [...previousRows, lastRowBuilder];
}

export function getValues(
    components: ActionRow<MessageActionRowComponent>[],
    value: string
) {
    return [...components.map((row) => {
        const component = row.components[0];
        return component && component.type === ComponentType.StringSelect && component.options.find(opt => opt.default)?.value;
    }).filter((row): row is string => !!row), value];
}

export async function getBuffer(url: string) {
    return await axios.get(url, { responseType: "arraybuffer" }).then((response) => Buffer.from(response.data));
}

export class ExpireMap<V> extends Map<string, V> {
    private expires: Map<string, Date>

    constructor(
        private expireTime: number
    ) {
        super();
        this.expires = new Map();
    }

    get(key: string) {
        if (!this.has(key)) return undefined;
        if (this.expires.get(key)! < new Date()) {
            this.delete(key);
            this.expires.delete(key.toString());
            return undefined;
        }
        return super.get(key);
    }

    set(key: string, value: V) {
        this.expires.set(key.toString(), new Date(Date.now() + this.expireTime));
        return super.set(key, value);
    }
}

export const minuteInMillis = 60000;

function getEpochNanoseconds() {
    const epochMilliseconds = Date.now();

    const hrTime = process.hrtime();

    const millisToNanos = epochMilliseconds * 1000000;
    const nanoRemainder = hrTime[1];

    return (millisToNanos + nanoRemainder).toString();
}

export async function chatInputAnalyticsSend(commandName: string, success: boolean, error?: unknown) {
    await axios.post(process.env.GRAFANA_URL as string, {
        "streams": [
            {
                "stream": {
                    "label": "enka_discord",
                    "command_name": commandName,
                    success
                },
                "values": [
                    [ getEpochNanoseconds().toString(), success ? 'Command Succeeded' : typeof error === 'object' ? JSON.stringify(error) : error!.toString() ]
                ]
            }
        ]
    })
}

export async function customIdAnalyticsSend(customId: string, error: unknown) {
    const data = {
        "streams": [
            {
                "stream": {
                    "label": "enka_discord",
                    "interaction": customId,
                    "success": false
                },
                "values": [
                    [ getEpochNanoseconds().toString(), typeof error === 'object' ? JSON.stringify(error) : error!.toString() ]
                ]
            }
        ]
    }
    await axios.post(process.env.GRAFANA_URL as string, data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}
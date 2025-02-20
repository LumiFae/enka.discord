import * as fs from "node:fs";
import path from "path";
import {parse} from "yaml";
import {db} from "./db";
import {eq} from "drizzle-orm";
import {users} from "../schema";
import {Interaction} from "discord.js";

type LocalizationConfig = {
    user_not_found: string;
    incorrect_interaction: string;
    error: string;
    build: {
        select_character: string;
        live_build: string;
        card_embed_title: string;
        name: {
            no_profiles: string;
            select_profile: string;
            select_build: string;
            build_select_embed: {
                title: string;
                description: string;
            };
        };
        uid: {
            select_game: string;
            no_found_uid: string;
            unsupported_game: string;
            game_select_embed: {
                title: string;
                description: string;
            };
            character_embed_title: string;
            genshin_uid: string;
            honkai_uid: string;
            zenless_uid: string;
        };
    };
    profile: {
        title: string;
        patreon_tier: string;
        view_profile: string;
    };
    about: {
        description: string;
        contributors: string;
        ping: string;
        uptime: string;
        install_count: {
            title: string;
            description: string;
        };
        translators: string;
        github: string;
        invite: string;
        donate: string;
        help_translate: string;
    };
    help: {
        title: string;
        description: string;
        page_count: string;
        previous: string;
        next: string;
    };
    connect: {
        verify: string;
        cancel: string;
        code_expire: string;
        not_found: string;
        success: string;
        error: string;
        fail: string;
        cancelled: string;
        incorrect: string;
        embed: {
            title: string;
            description: string;
            footer: string;
        };
    };
    disconnect: {
        no_account: string;
        embed: {
            title: string;
            description: string;
        };
        disconnect: string;
        cancel: string;
        success: string;
        cancelled: string;
    };
    config: {
        language: {
            set: string;
            set_auto: string;
        }
    }
};

function loadLocale(locale: string) {
    const content = fs.readFileSync(path.resolve(__dirname, `../../locales/${locale}.yml`), "utf-8")
    return parse(content) as LocalizationConfig;
}

const localeConverts = {
    "en-GB": "en",
    "en-US": "en",
    "es-ES": "es"
} as const;

export function getFromInteraction(interaction: Interaction): string {
    return localeConverts[interaction.locale] ?? interaction.locale ?? "en";
}

export default class Locales {
    private static loaded: Record<string, LocalizationConfig> = {}
    private loaded: LocalizationConfig
    locale: string;

    constructor(locale: string, content: LocalizationConfig) {
        if(!Locales.loaded[locale]) Locales.loaded[locale] = content
        this.loaded = content;
        this.locale = locale;
    }

    get(func: (lang: LocalizationConfig) => string) {
        let ret: string;
        try {
            ret = func(this.loaded) ?? func(Locales.loaded.en)
        } catch(e) {
            ret = func(Locales.loaded.en)
        }
        return ret;
    }

    async setLanguage(id: string, locale: string, reset = false) {
        await db.insert(users)
            .values({ id, enka_name: null, locale: reset ? null : locale })
            .onConflictDoUpdate({
                target: users.id,
                set: { locale: reset ? null : locale }
            })
            .execute();
        const newLocale = Locales.get(locale);
        this.loaded = newLocale.loaded;
        this.locale = locale;
    }

    static get(locale: string) {
        if(!Locales.exists(locale)) return new Locales("en", Locales.loaded.en ?? loadLocale("en"))
        if(!Locales.loaded[locale]) return new Locales(locale, loadLocale(locale))
        return new Locales(locale, Locales.loaded[locale])
    }

    private static exists(locale: string) {
        return fs.existsSync(path.resolve(__dirname, `../../locales/${locale}.yml`))
    }
}
import * as fs from "node:fs";
import path from "path";
import {parse} from "yaml";
import {db} from "./db";
import {eq} from "drizzle-orm";
import {users} from "../schema";

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
        }
    }
};

function loadLocale(locale: string) {
    const content = fs.readFileSync(path.resolve(__dirname, `../../locales/${locale}.yml`), "utf-8")
    return parse(content) as LocalizationConfig;
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

    async setLanguage(id: string, locale: string) {
        await db.insert(users)
            .values({ id, enka_name: null, locale })
            .onConflictDoUpdate({
                target: users.id,
                set: { locale }
            })
            .execute();
        const newLocale = Locales.get(locale);
        this.loaded = newLocale.loaded;
        this.locale = locale;
    }

    static get(locale: string) {
        if(!Locales.loaded[locale]) return new Locales(locale, loadLocale(locale))
        return new Locales(locale, Locales.loaded[locale])
    }
}
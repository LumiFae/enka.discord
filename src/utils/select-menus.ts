import {DjBuild, DjHoyoProfile} from "../types/models";
import {StringSelectMenuBuilder, StringSelectMenuOptionBuilder} from "discord.js";
import {getCharacter} from "./misc";
import UID from "./uid";
import Locales from "./locales";

export function selectCharacter(builds: Record<string, DjBuild[]>, locale: Locales){
    return new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId("select_character")
        .setPlaceholder(locale.get(l => l.build.select_character))
        .setOptions(Object.keys(builds).map((build) => {
            const hoyoType = builds[build][0].hoyo_type;
            const char = getCharacter(locale, hoyoType, build);

            return new StringSelectMenuOptionBuilder()
                .setLabel(char.name)
                .setValue(char.id)
                .setEmoji(char.emojiFromElement)
        }))
}

export function selectUidCharacter(uidResponse: UID, locale: Locales){
    return new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId("uid_select_character")
        .setPlaceholder(locale.get(l => l.build.select_character))
        .setOptions(uidResponse.avatars.map((avatar) => new StringSelectMenuOptionBuilder()
            .setLabel(avatar.name)
            .setValue(avatar.id)
            .setEmoji(avatar.emojiFromElement)
        ))
}
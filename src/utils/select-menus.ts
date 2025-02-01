import {DjHoyoProfile} from "../types/models";
import {StringSelectMenuBuilder, StringSelectMenuOptionBuilder} from "discord.js";
import {getCharacter} from "./misc";
import UID from "./uid";

export function selectCharacter(profile: DjHoyoProfile){
    return new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId("select_character")
        .setPlaceholder("Select a character")
        .setOptions(Object.keys(profile.avatar_order!).map((x) => {
            const str = String(x);
            const char = getCharacter(profile.hoyo_type, str);

            return new StringSelectMenuOptionBuilder()
                .setLabel(char.name)
                .setValue(char.id)
                .setEmoji(char.emojiFromElement)
        }))
}

export function selectUidCharacter(uidResponse: UID){
    return new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId("uid_select_character")
        .setPlaceholder("Select a character")
        .setOptions(uidResponse.avatars.map((avatar) => new StringSelectMenuOptionBuilder()
            .setLabel(avatar.name)
            .setValue(avatar.id)
            .setEmoji(avatar.emojiFromElement)
        ))
}
import {Hoyo, HoyoCharacters, NoProfile} from "../types/enka";
import {api, Characters, get, getGICharacters, getHSRCharacters} from "./api";
import {
    CacheType,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";

export async function selectCharacter(interaction: Interaction<CacheType>, name: string, profile: Hoyo, selectMenu: StringSelectMenuBuilder = new StringSelectMenuBuilder()) {
    const avatars = Object.keys(profile.avatar_order as Record<number, number>);
    const characters = profile.hoyo_type === 0 ? await getGICharacters() : await getHSRCharacters();
    const builds = await api.hoyosBuilds(name, profile.hash);
    if(!builds) {
        return null;
    }
    const guild = await interaction.client.guilds.fetch("1009500653665648791");
    const emojis = await guild.emojis.fetch();
    const profileCharacters = (await Promise.all(avatars.map(async char => {
        const character = characters.find(character => character.characterId === char);
        if(!character) return null;
        if(!builds.data[character.characterId] || !builds.data[character.characterId].length) return null;
        const emojiId = emojis.find(emoji => emoji.name === `${profile.hoyo_type === 0 ? "GI" : "HSR"}${character.element}`)?.id;
        if(!emojiId) return null;
        return { character, builds: builds.data, emojiId };
    }))).filter((char): char is { character: Characters, builds: HoyoCharacters, emojiId: string } => char !== null);
    selectMenu.setCustomId("name_select_character")
    selectMenu.setPlaceholder("Select a character")
    selectMenu.setOptions(profileCharacters.map((char) => {
        return new StringSelectMenuOptionBuilder()
            .setLabel(char.character.name)
            .setValue(char.character.characterId)
            .setDescription(`Select a build for ${char.character.name}`)
            .setEmoji(char.emojiId)
    }))
    return selectMenu;
}
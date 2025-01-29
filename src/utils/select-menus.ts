import {GIUIDLookup, Hoyo, HoyoCharacters, HSRUIDLookup, NoProfile, ZZZUIDLookup} from "../types/enka";
import {api, characters, Characters, get, getGICharacters, getHSRCharacters, hoyo_type} from "./api";
import {
    CacheType,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";
import {emojiIds} from "./misc";

function getSortedAvatars(avatarOrder: Record<number, number> | null, avatarInfoList?: { level: number; avatarId: number }[]): string[] {
    if(!avatarOrder) {
        return avatarInfoList?.map(avatar => avatar.avatarId.toString()) || [];
    }
    return Object.entries(avatarOrder)
        .sort(([, orderA], [, orderB]) => orderA - orderB)
        .map(([avatar]) => avatar);
}

export async function selectCharacter(interaction: Interaction<CacheType>, name: string, profile: Hoyo, selectMenu: StringSelectMenuBuilder = new StringSelectMenuBuilder().setMaxValues(1).setMinValues(1)) {
    const avatarInfoList = profile.hoyo_type === 0 ? 'showAvatarInfoList' in profile.player_info ? profile.player_info.showAvatarInfoList : undefined : 'avatarDetailList' in profile.player_info ? profile.player_info.avatarDetailList : undefined;
    const avatars = getSortedAvatars(profile.avatar_order, avatarInfoList);

    const builds = await api.hoyosBuilds(name, profile.hash);
    if(!builds) {
        return null;
    }
    const profileCharacters = (await Promise.all(avatars.map(async char => {
        const character = await characters.getCharacterById(profile.hoyo_type, char);
        if(!character) return null;
        if(!builds.data[character.characterId] || !builds.data[character.characterId].length) return null;
        const emojiId = emojiIds[`${profile.hoyo_type === hoyo_type.Genshin ? "GI" : profile.hoyo_type === hoyo_type.Honkai ? "HSR" : "ZZZ"}${character.element}`];
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

export async function selectUidCharacter(uid: string, game: string, selectMenu: StringSelectMenuBuilder = new StringSelectMenuBuilder().setMaxValues(1).setMinValues(1)) {
    const characterList = await api.uid(uid, game === "genshin" ? 0 : game === "honkai" ? 1 : 2);
    if(!characterList) {
        return null;
    }
    const profileCharacters: Characters[] = [];
    if(game === "honkai") {
        const data = characterList.data as HSRUIDLookup;
        for(const char of data.detailInfo.avatarDetailList){
            const character = await characters.getCharacterById(hoyo_type.Honkai, char.avatarId.toString());
            if(!character) continue;
            profileCharacters.push(character);
        }
    } else if (game === "genshin") {
        const data = characterList.data as GIUIDLookup;
        for(const char of data.avatarInfoList) {
            const character = await characters.getCharacterById(hoyo_type.Genshin, char.avatarId.toString());
            if(!character) continue;
            profileCharacters.push(character);
        }
    } else {
        const data = characterList.data as ZZZUIDLookup;
        for(const char of data.PlayerInfo.ShowcaseDetail.AvatarList) {
            const character = await characters.getCharacterById(hoyo_type.Zenless, char.Id.toString());
            if(!character) continue;
            profileCharacters.push(character);
        }
    }
    selectMenu.setCustomId("uid_select_character")
    selectMenu.setPlaceholder("Select a character")
    selectMenu.setOptions(profileCharacters.map((char) => {
        return new StringSelectMenuOptionBuilder()
            .setLabel(char.name)
            .setValue(char.characterId)
            .setDescription(`Select a build for ${char.name}`)
            .setEmoji(emojiIds[`${game === "genshin" ? "GI" : game === "honkai" ? "HSR" : "ZZZ"}${char.element}`])
    }))
    return selectMenu;
}
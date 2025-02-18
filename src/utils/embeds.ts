import {AttachmentBuilder, ColorResolvable, EmbedBuilder as BaseEmbedBuilder} from "discord.js";
import {getBuffer, getCharacter} from "./misc";
import {DjBuild} from "../types/models";
import Locales from "./locales";

export class EmbedBuilder extends BaseEmbedBuilder {
    constructor() {
        super();
        this.setColor("#fc9c88")
    }
}

export function connectAccountEmbed(username: string, code: string, locale: Locales) {
    return new EmbedBuilder()
        .setTitle(locale.get(l => l.connect.embed.title))
        .setDescription(locale.get(l => l.connect.embed.description).replace("{username}", username).replace("{code}", code))
        .setFooter({ text: locale.get(l => l.connect.embed.footer) })
}

export function generateBuildEmbed(name: string, locale: Locales, color?: ColorResolvable) {
    return (!color ? new EmbedBuilder() : new EmbedBuilder().setColor(color))
        .setTitle(locale.get(l => l.build.name.build_select_embed.title))
        .setDescription(locale.get(l => l.build.name.build_select_embed.description))
        .setFooter({ text: name })
}

export function generateUidBuildEmbed(uid: string, locale: Locales, color?: ColorResolvable) {
    return (!color ? new EmbedBuilder() : new EmbedBuilder().setColor(color))
        .setTitle(locale.get(l => l.build.uid.game_select_embed.title))
        .setDescription(locale.get(l => l.build.uid.game_select_embed.description))
        .setFooter({ text: uid })
}

export async function generateCardEmbed(name: string, hash: string, build: DjBuild, locale: Locales): Promise<[EmbedBuilder, AttachmentBuilder]> {
    const card = await getBuffer(`https://cards.enka.network/u/${name}/${hash}/${build.avatar_id}/${build.id}/image?lang=${locale.locale}`)
    const imgName = `${name}-${hash}-${build.avatar_id}-${build.id}.png`;

    const attachment = new AttachmentBuilder(card, { name: imgName })

    const character = getCharacter(locale, build.hoyo_type, build.avatar_id)

    return [new EmbedBuilder()
        .setTitle(locale.get(l => l.build.card_embed_title).replace("{name}", build.name || locale.get(l => l.build.live_build)))
        .setImage(`attachment://${imgName}`)
        .setFooter({ text: name })
        .setColor(character.colorFromElement), attachment]
}
import {AttachmentBuilder, ColorResolvable, EmbedBuilder as BaseEmbedBuilder} from "discord.js";
import {getBuffer, getCharacter} from "./misc";
import {DjBuild} from "../types/models";

export class EmbedBuilder extends BaseEmbedBuilder {
    constructor() {
        super();
        this.setColor("#fc9c88")
    }
}

export function connectAccountEmbed(username: string, code: string) {
    return new EmbedBuilder()
        .setTitle("Connect your account")
        .setDescription(`To connect your Discord account to ${username}, please include the following code inside your bio ([User Settings](https://enka.network/profile/settings/)): \`${code}\`

Once this has been completed, click the \`Verify\` button below.
To cancel, click the \`Cancel\` button.`)
        .setFooter({ text: "This code will expire in 5 minutes" })
}

export function generateBuildEmbed(name: string, color?: ColorResolvable) {
    return (!color ? new EmbedBuilder() : new EmbedBuilder().setColor(color))
        .setTitle(`Select a build`)
        .setDescription("From the select menus below, choose the builds you want to view")
        .setFooter({ text: name })
}

export function generateUidBuildEmbed(uid: string, color?: ColorResolvable) {
    return (!color ? new EmbedBuilder() : new EmbedBuilder().setColor(color))
        .setTitle("Select a game")
        .setDescription("In the select menu below, choose the game this UID relates to and build you want to view")
        .setFooter({ text: uid })
}

export async function generateCardEmbed(name: string, hash: string, build: DjBuild): Promise<[EmbedBuilder, AttachmentBuilder]> {
    const card = await getBuffer(`https://cards.enka.network/u/${name}/${hash}/${build.avatar_id}/${build.id}/image`)
    const imgName = `${name}-${hash}-${build.avatar_id}-${build.id}.png`;

    const attachment = new AttachmentBuilder(card, { name: imgName })

    const character = getCharacter(build.hoyo_type, build.avatar_id)

    return [new EmbedBuilder()
        .setTitle(`Build: ${build.name || "Live"}`)
        .setImage(`attachment://${imgName}`)
        .setFooter({ text: name })
        .setColor(character.colorFromElement), attachment]
}
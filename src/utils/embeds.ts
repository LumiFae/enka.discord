import {ColorResolvable, EmbedBuilder} from "discord.js";
import {ProfileInfo} from "../types/enka";

export function Embed() {
    return new EmbedBuilder().setColor("#fc9c88")
}

export function connectAccountEmbed(profile: ProfileInfo, code: string) {
    return Embed()
        .setTitle("Connect your account")
        .setDescription(`To connect your Discord account to ${profile.username}, please include the following code inside your bio ([User Settings](https://enka.network/profile/settings/)): \`${code}\`

Once this has been completed, click the \`Verify\` button below.
To cancel, click the \`Cancel\` button.`)
        .setFooter({ text: "This code will expire in 5 minutes" })
}

export function generateBuildEmbed(name: string, color?: ColorResolvable) {
    return (!color ? Embed() : new EmbedBuilder().setColor(color))
        .setTitle(`Select a build`)
        .setDescription("From the select menus below, choose the builds you want to view")
        .setFooter({ text: `Related account: ${name}`})
}

export function generateUidBuildEmbed(uid: string, color?: ColorResolvable) {
    return (!color ? Embed() : new EmbedBuilder().setColor(color))
        .setTitle("Select a game")
        .setDescription("In the select menu below, choose the game this UID relates to and build you want to view")
        .setFooter({ text: `Related UID: ${uid}`})
}
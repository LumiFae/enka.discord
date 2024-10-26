import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../../types/discord";
import {Embed} from "../../utils/embeds";
import { started } from "../../index";

export default {
    name: "about",
    role: "CHAT_INPUT",
    description: "Get information about the bot",
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction) => {
        const embed = Embed()
            .setTitle("enka.discord")
            .setDescription("An open-source Discord bot designed to make your gacha life easier with the power of enka.network")
            .addFields({
                name: "Contributors",
                value: "[@jxtq](<https://discord.com/users/618689346828238848>) ([@jxtq.bsky.social](<https://bsky.app/profile/jxtq.bsky.social>))"
            },{
                name: "Ping",
                value: `${interaction.client.ws.ping}ms`,
                inline: true
            },{
                name: "Uptime",
                value: `<t:${Math.floor(started / 1000)}:R>`,
                inline: true
            }, {
                name: "Install Count (Servers and Users)",
                value: `Servers: ${interaction.client.guilds.cache.size}\nUsers: ${interaction.client.application.approximateUserInstallCount}`,
                inline: true
            })

        const ghButton = new ButtonBuilder()
            .setLabel("GitHub")
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/JayXTQ/enka.discord")

        const inviteButton = new ButtonBuilder()
            .setLabel("Invite")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1296584939583701044")

        const donateButton = new ButtonBuilder()
            .setLabel("Donate")
            .setStyle(ButtonStyle.Link)
            .setURL("https://ko-fi.com/jxtq")

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(ghButton, inviteButton, donateButton)

        await interaction.reply({ embeds: [embed], components: [row] })
    },
} satisfies Command;

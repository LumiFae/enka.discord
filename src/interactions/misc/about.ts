import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../../types/discord";
import { started } from "../../index";
import {EmbedBuilder} from "../../utils/embeds";

export default {
    name: "about",
    role: "CHAT_INPUT",
    description: "Get information about the bot",
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction, locale) => {
        await interaction.client.application.fetch();
        const embed = new EmbedBuilder()
            .setTitle("enka.discord")
            .setDescription(locale.get(l => l.about.description))
            .addFields({
                name: locale.get(l => l.about.contributors),
                value: "[@jxtq](<https://discord.com/users/618689346828238848>) ([@jxtq.moe](<https://bsky.app/profile/jxtq.moe>))"
            },{
                name: locale.get(l => l.about.ping),
                value: `${interaction.client.ws.ping}ms`,
                inline: true
            },{
                name: locale.get(l => l.about.uptime),
                value: `<t:${Math.floor(started / 1000)}:R>`,
                inline: true
            }, {
                name: locale.get(l => l.about.install_count.title),
                value: locale.get(l => l.about.install_count.description).replace("{guilds}", interaction.client.guilds.cache.size.toString()).replace("{users}", (interaction.client.application.approximateUserInstallCount ?? 0).toString()),
                inline: true
            }, {
                name: locale.get(l => l.about.translators),
                value: "English: [@jxtq](<https://discord.com/users/618689346828238848>)\nRussian: [@lunyslasher](<https://discord.com/users/324832697233178627>)",
                inline: true
            })

        const ghButton = new ButtonBuilder()
            .setLabel(locale.get(l => l.about.github))
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/LumiFae/enka.discord")

        const inviteButton = new ButtonBuilder()
            .setLabel(locale.get(l => l.about.invite))
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1296584939583701044")

        const donateButton = new ButtonBuilder()
            .setLabel(locale.get(l => l.about.donate))
            .setStyle(ButtonStyle.Link)
            .setURL("https://ko-fi.com/jxtq")

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(ghButton, inviteButton, donateButton)

        await interaction.reply({ embeds: [embed], components: [row] })
    },
} satisfies Command;

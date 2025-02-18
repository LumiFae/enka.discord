import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlagsBitField} from "discord.js";
import { Command } from "../../../types/discord";
import { commands } from "../../../index";
import {EmbedBuilder} from "../../../utils/embeds";

export default {
    name: "help",
    role: "CHAT_INPUT",
    description: "Get help with the bot",
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction, locale) => {
        const embed_ = new EmbedBuilder()
            .setTitle(locale.get(l => l.help.title))
            .setDescription(
                locale.get(l => l.help.description),
            );

        let fields: { name: string; value: string }[] = [];

        for (const [name, command] of commands) {
            if (command.role === "CHAT_INPUT")
                fields.push({ name: name, value: command.description });
        }

        let pagify = false;

        if (fields.length > 10) {
            const pageCount = Math.ceil(fields.length / 10);
            pagify = true;
            fields = fields.slice(0, 10);
            embed_.setFooter({
                text: locale.get(l => l.help.page_count).replace("{current}", "1").replace("{max}", pageCount.toString())
            });
        }

        embed_.addFields(fields);

        if (pagify) {
            const previous = new ButtonBuilder()
                .setCustomId("previous")
                .setLabel(locale.get(l => l.help.previous))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);
            const next = new ButtonBuilder()
                .setCustomId("next")
                .setLabel(locale.get(l => l.help.next))
                .setStyle(ButtonStyle.Primary);
            const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
                previous,
                next,
            );
            return await interaction.reply({
                embeds: [embed_],
                components: [row],
                flags: MessageFlagsBitField.Flags.Ephemeral,
            });
        }
        await interaction.reply({ embeds: [embed_],
            flags: MessageFlagsBitField.Flags.Ephemeral, });
    },
} satisfies Command;
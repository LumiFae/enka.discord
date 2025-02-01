import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlagsBitField} from "discord.js";
import { Command } from "../../../types/discord";
import { commands } from "../../../index";
import {EmbedBuilder} from "../../../utils/embeds";

export default {
    custom_id: "next",
    role: "BUTTON",
    run: async (interaction) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral,
            });
        }
        const originEmbed = interaction.message.embeds[0];
        const pageNumber = parseInt(
            originEmbed.footer?.text.split(" ")[1] as string,
        );

        let fields: { name: string; value: string }[] = [];
        for (const [name, command] of commands) {
            if (command.role === "CHAT_INPUT")
                fields.push({ name: name, value: command.description });
        }
        const pageCount = Math.ceil(fields.length / 10);
        const footer = `Page ${(pageNumber + 1).toString()} out of ${pageCount.toString()}`

        fields = fields.slice(pageNumber * 10, (pageNumber + 1) * 10);

        const embed_ = new EmbedBuilder()
            .setTitle(originEmbed.title)
            .setDescription(originEmbed.description)
            .addFields(fields)
            .setFooter({ text: footer });

        const previous = new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary);

        let next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary);

        if (pageNumber + 1 === pageCount) {
            next.setDisabled(true);
        }

        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
            previous,
            next,
        );
        await interaction.message.edit({ embeds: [embed_], components: [row] });
        await interaction.deferUpdate();
    },
} satisfies Command;

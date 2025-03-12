import { Command } from "../../../types/discord";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlagsBitField} from "discord.js";
import {db} from "../../../utils/db";
import {users} from "../../../schema";
import {eq} from "drizzle-orm";
import {EmbedBuilder} from "../../../utils/embeds";

export default {
    name: "disconnect",
    role: "CHAT_INPUT",
    description: "Disconnect your enka.network account",
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction, locale) =>  {
        await interaction.deferReply({
            flags: MessageFlagsBitField.Flags.Ephemeral
        });

        const user = await db.query.users.findFirst({ where: eq(users.id, interaction.user.id) });

        if(!user || !user.enka_name) {
            await interaction.editReply({ content: locale.get(l => l.disconnect.no_account) });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(locale.get(l => l.disconnect.embed.title))
            .setDescription(locale.get(l => l.disconnect.embed.description))

        const disconnectButton = new ButtonBuilder()
            .setCustomId("account_disconnect")
            .setLabel(locale.get(l => l.disconnect.disconnect))
            .setStyle(ButtonStyle.Danger)

        const cancelButton = new ButtonBuilder()
            .setCustomId("account_disconnect_cancel")
            .setLabel(locale.get(l => l.disconnect.cancel))
            .setStyle(ButtonStyle.Primary)

        await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().setComponents(disconnectButton, cancelButton)] });
    },
} satisfies Command;

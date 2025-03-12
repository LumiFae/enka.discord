import { Command } from "../../../types/discord";
import {MessageFlagsBitField} from "discord.js";

export default {
    custom_id: "account_disconnect_cancel",
    role: "BUTTON",
    run: async (interaction, locale) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: locale.get(l => l.incorrect_interaction),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }
        await interaction.update({ content: locale.get(l => l.disconnect.cancelled), embeds: [], components: [] });
    },
} satisfies Command;

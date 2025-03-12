import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {MessageFlagsBitField} from "discord.js";

export default {
    custom_id: "account_connect_cancel",
    role: "BUTTON",
    run: async (interaction, locale) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: locale.get(l => l.incorrect_interaction),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }
        userVerifCodes.delete(interaction.user.id);
        await interaction.update({ content: locale.get(l => l.connect.cancelled), embeds: [], components: [] });
    },
} satisfies Command;

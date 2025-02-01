import { Command } from "../../../types/discord";
import {MessageFlagsBitField} from "discord.js";

export default {
    custom_id: "account_disconnect_cancel",
    role: "BUTTON",
    run: async (interaction) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral,
            });
        }
        await interaction.update({ content: "Disconnect cancelled", embeds: [], components: [] });
    },
} satisfies Command;

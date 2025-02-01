import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {MessageFlagsBitField} from "discord.js";

export default {
    custom_id: "account_connect_cancel",
    role: "BUTTON",
    run: async (interaction) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral,
            });
        }
        userVerifCodes.delete(interaction.user.id);
        await interaction.update({ content: "Connection cancelled", embeds: [], components: [] });
    },
} satisfies Command;

import { Command } from "../../types/discord";
import {MessageFlagsBitField} from "discord.js";

export default {
    name: "invite",
    role: "CHAT_INPUT",
    description: "Get the bot's invite",
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction) => {
        await interaction.reply({ content: "https://discord.com/oauth2/authorize?client_id=1296584939583701044", flags: MessageFlagsBitField.Flags.Ephemeral })
    },
} satisfies Command;

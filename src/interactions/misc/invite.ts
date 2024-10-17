import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../../types/discord";

export default {
    name: "invite",
    role: "CHAT_INPUT",
    description: "Get the bot's invite",
    run: async (interaction) => {
        await interaction.reply({ content: "https://discord.com/oauth2/authorize?client_id=1296584939583701044", ephemeral: true })
    },
} satisfies Command;

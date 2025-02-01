import { Command } from "../../../types/discord";
import {db} from "../../../utils/db";
import {users} from "../../../schema";
import {eq} from "drizzle-orm";
import {MessageFlagsBitField} from "discord.js";

export default {
    custom_id: "account_disconnect",
    role: "BUTTON",
    run: async (interaction) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral,
            });
        }
        await interaction.deferUpdate();

        const user = await db.query.users.findFirst({ where: eq(users.id, interaction.user.id) });

        if(!user || !user.enka_name) {
            await interaction.editReply({ content: "You don't have an account connected", embeds: [], components: [] });
            return;
        }

        await db.delete(users).where(eq(users.id, interaction.user.id)).execute();

        await interaction.editReply({ content: "Account disconnected successfully", embeds: [], components: [] });
    },
} satisfies Command;

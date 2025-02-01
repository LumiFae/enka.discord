import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {db} from "../../../utils/db";
import {users} from "../../../schema";
import axios from "axios";
import API from "../../../utils/api";
import {EmbedBuilder} from "../../../utils/embeds";

export default {
    custom_id: "account_connect",
    role: "BUTTON",
    run: async (interaction) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: "You can not interact with another users command",
                ephemeral: true,
            });
        }
        await interaction.deferUpdate();

        const code = userVerifCodes.get(interaction.user.id);
        if (!code) {
            await interaction.editReply({ content: "Your code either expired or there was an error, try again", embeds: [], components: [] });
            return;
        }
        const response = await API.profile(code.name);
        if (!response) {
            await interaction.editReply({ content: "User not found, try again", embeds: [], components: [] });
            return;
        }

        if(response.profile.bio.includes(code.code)) {
            try {
                await db.insert(users).values({
                    id: interaction.user.id,
                    enka_name: code.name
                }).onConflictDoUpdate({target: users.id, set: {enka_name: code.name}}).execute();
                await interaction.editReply({content: "Account connected successfully", embeds: [], components: []});
            } catch (e: unknown) {
                await interaction.editReply({content: "An error occurred while connecting your account, please try again", embeds: [], components: []});
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle("Incorrect code")
                .setDescription("The code you entered is incorrect, please try again. Your code is: " + code.code)
            await interaction.editReply({ embeds: [embed] });
        }
    },
} satisfies Command;

import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {db} from "../../../utils/db";
import {users} from "../../../schema";
import axios from "axios";
import API from "../../../utils/api";
import {EmbedBuilder} from "../../../utils/embeds";
import {MessageFlagsBitField} from "discord.js";

export default {
    custom_id: "account_connect",
    role: "BUTTON",
    run: async (interaction, locale) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: locale.get(l => l.incorrect_interaction),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }
        await interaction.deferUpdate();

        const code = userVerifCodes.get(interaction.user.id);
        if (!code) {
            await interaction.editReply({ content: locale.get(l => l.connect.code_expire), embeds: [], components: [] });
            return;
        }
        const response = await API.profile(code.name);
        if (!response) {
            await interaction.editReply({ content: locale.get(l => l.connect.not_found), embeds: [], components: [] });
            return;
        }

        if(response.profile.bio.includes(code.code)) {
            try {
                await db.insert(users).values({
                    id: interaction.user.id,
                    enka_name: code.name
                }).onConflictDoUpdate({target: users.id, set: {enka_name: code.name}}).execute();
                await interaction.editReply({content: locale.get(l => l.connect.success), embeds: [], components: []});
            } catch (e: unknown) {
                await interaction.editReply({content: locale.get(l => l.connect.error), embeds: [], components: []});
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle(locale.get(l => l.connect.incorrect))
                .setDescription(locale.get(l => l.connect.fail).replace("{code}", code.code))
            await interaction.editReply({ embeds: [embed] });
        }
    },
} satisfies Command;

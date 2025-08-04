import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {generateRandomCapitalString} from "../../../utils/misc";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlagsBitField} from "discord.js";
import {connectAccountEmbed} from "../../../utils/embeds";
import API from "../../../utils/api";

export default {
    name: "connect",
    role: "CHAT_INPUT",
    description: "Connect your Discord account to your enka.network account",
    options: [
        {
            type: 3,
            name: "name",
            description: "The name of the account you wish to connect",
            required: true,
        },
    ],
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction, locale) =>  {
        await interaction.deferReply({
            flags: MessageFlagsBitField.Flags.Ephemeral
        })
        const name = interaction.options.getString("name", true);
        const response = await API.profile(name);
        if (!response) {
            await interaction.editReply({ content: locale.get(l => l.connect.not_found) });
            return;
        }
        const code = generateRandomCapitalString(6);
        userVerifCodes.setCode(interaction.user.id, {
            code,
            name
        });
        console.log(userVerifCodes.get(interaction.user.id))
        const embed = connectAccountEmbed(response.username, code, locale);

        const verifyButton = new ButtonBuilder()
            .setCustomId("account_connect")
            .setLabel(locale.get(l => l.connect.verify))
            .setStyle(ButtonStyle.Success)

        const cancelButton = new ButtonBuilder()
            .setCustomId("account_connect_cancel")
            .setLabel(locale.get(l => l.connect.cancel))
            .setStyle(ButtonStyle.Danger)

        await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().setComponents(verifyButton, cancelButton)] });
    },
} satisfies Command;

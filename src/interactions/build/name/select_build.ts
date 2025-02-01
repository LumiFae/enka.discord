import {Command} from "../../../types/discord";
import {EmbedBuilder, generateBuildEmbed, generateCardEmbed} from "../../../utils/embeds";
import {getValues, sameUser, setDefault} from "../../../utils/misc";
import API from "../../../utils/api";
import {ActionRowBuilder, InteractionReplyOptions, MessageFlagsBitField, StringSelectMenuBuilder} from "discord.js";
import { selectCharacter} from "../../../utils/select-menus";


export default {
    role: "SELECT_MENU",
    custom_id: "select_build",
    run: async (interaction) => {
        if(!sameUser(interaction)) {
            return await interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const errorMsg = "An error occurred whilst trying to complete this. Try again."

        const values = getValues(interaction.message.components.slice(0,2), interaction.values[0]);

        const name = interaction.message.embeds[0].footer?.text;
        if(!name) return await interaction.reply({
            content: errorMsg,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });

        await interaction.deferUpdate()
        const builds = await API.builds(name, values[0])
        if(!builds) return await interaction.editReply({
            content: errorMsg
        })

        const build = builds[values[1]].find((build) => String(build.id) === values[2]);
        if(!build) return await interaction.editReply({
            content: errorMsg
        })

        const [embed, attachment] = await generateCardEmbed(name, values[0], build);

        const components = setDefault(interaction.message.components.slice(0,3), values[2])

        return await interaction.editReply({
            embeds: [embed],
            files: [attachment],
            components
        })
    }
} satisfies Command;
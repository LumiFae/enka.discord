import {Command} from "../../../types/discord";
import {EmbedBuilder, generateBuildEmbed} from "../../../utils/embeds";
import {getValues, sameUser, setDefault} from "../../../utils/misc";
import API from "../../../utils/api";
import {ActionRowBuilder, InteractionReplyOptions, MessageFlagsBitField, StringSelectMenuBuilder} from "discord.js";
import { selectCharacter} from "../../../utils/select-menus";


export default {
    role: "SELECT_MENU",
    custom_id: "select_profile",
    run: async (interaction, locale) => {
        if(!sameUser(interaction)) {
            return await interaction.reply({
                content: locale.get(lang => lang.incorrect_interaction),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const errorMsg = locale.get(lang => lang.error)

        const value = interaction.values[0];

        const name = interaction.message.embeds[0].footer?.text;
        if(!name) return await interaction.reply({
            content: errorMsg,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });

        await interaction.deferUpdate()

        const builds = await API.builds(name, value);
        if(!builds) return await interaction.editReply({ content: errorMsg });

        const oldComponents = setDefault(interaction.message.components.slice(0, 1), value);

        const selectMenu = selectCharacter(builds, locale);

        const components = [...oldComponents, new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)];

        interaction.editReply({ components, embeds: [generateBuildEmbed(name, locale)], files: [] })
    }
} satisfies Command;
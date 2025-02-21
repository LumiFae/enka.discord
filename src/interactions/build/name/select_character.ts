import {Command} from "../../../types/discord";
import {getCharacter, getValues, sameUser, setDefault} from "../../../utils/misc";
import API from "../../../utils/api";
import {
    ActionRowBuilder, EmbedBuilder,
    MessageFlagsBitField,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";
import {generateBuildEmbed, generateCardEmbed} from "../../../utils/embeds";

export default {
    role: "SELECT_MENU",
    custom_id: "select_character",
    run: async (interaction, locale) => {
        if(!sameUser(interaction)) {
            return await interaction.reply({
                content: locale.get((lang) => lang.incorrect_interaction),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const errorMsg = locale.get((lang) => lang.error)

        const values = getValues(interaction.message.components.slice(0,1), interaction.values[0]);

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

        const characterBuilds = builds[values[1]].filter((build) => build.public);
        if(characterBuilds.length === 0) return await interaction.editReply({
            content: errorMsg
        })

        const components = setDefault(interaction.message.components.slice(0,2), values[1])

        const [embed, attachment] = await generateCardEmbed(name, values[0], characterBuilds[0], locale)

        if(characterBuilds.length > 1) {
            const selectMenu = new StringSelectMenuBuilder()
                .setMinValues(1)
                .setMaxValues(1)
                .setCustomId("select_build")
                .setPlaceholder(locale.get((lang) => lang.build.name.select_build))
                .setOptions(characterBuilds.map(build => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(build.name || locale.get(lang => lang.build.live_build))
                        .setValue(String(build.id))
                }))

            selectMenu.options[0].setDefault(true)

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)

            components.push(row)
        }

        return await interaction.editReply({
            embeds: [embed],
            files: [attachment],
            components
        })

    }
} satisfies Command;
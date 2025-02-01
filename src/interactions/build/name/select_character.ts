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
    run: async (interaction) => {
        if(!sameUser(interaction)) {
            return await interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const errorMsg = "An error occurred whilst trying to complete this. Try again."

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

        const characterBuilds = builds[values[1]];
        if(!characterBuilds) return await interaction.editReply({
            content: errorMsg
        })

        const components = setDefault(interaction.message.components.slice(0,2), values[1])

        if(characterBuilds.length === 1) {
            const [embed, attachment] = await generateCardEmbed(name, values[0], characterBuilds[0])

            return await interaction.editReply({
                embeds: [embed],
                files: [attachment],
                components
            })
        } else {
            const embed = generateBuildEmbed(name, getCharacter(characterBuilds[0].hoyo_type, values[1]).colorFromElement)

            const selectMenu = new StringSelectMenuBuilder()
                .setMinValues(1)
                .setMaxValues(1)
                .setCustomId("select_build")
                .setPlaceholder("Select a build")
                .setOptions(characterBuilds.map(build => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(build.name || "Live")
                        .setValue(String(build.id))
                }))

            return await interaction.editReply({
                embeds: [embed],
                files: [],
                components: [...components, new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)]
            })
        }
    }
} satisfies Command;
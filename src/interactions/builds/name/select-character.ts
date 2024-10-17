import {Command} from "../../../types/discord";
import {selectCharacter} from "../../../utils/select-menus";
import {api, get, getBuffer} from "../../../utils/api";
import {HoyoCharacterBuild, HoyoCharacters, HoyosRecord, NoProfile} from "../../../types/enka";
import {
    StringSelectMenuBuilder,
    ComponentType,
    ActionRowBuilder,
    EmbedBuilder,
    AttachmentBuilder,
    Attachment, StringSelectMenuOptionBuilder
} from "discord.js";
import {getSelectsFromMessage, getValues, makeAllSelectsDisabled} from "../../../utils/misc";
import {Embed, generateBuildEmbed} from "../../../utils/embeds";

export default {
    custom_id: "name_select_character",
    role: "SELECT_MENU",
    run: async (interaction) => {
        await interaction.deferUpdate();

        const name = interaction.message.embeds[0].footer?.text.split(": ")[1];

        if(!name) {
            await interaction.editReply({ content: "An error occurred, please try again", components: [], embeds: [], files: [] });
            return;
        }

        const values = getValues(interaction, ["name_select_profile"])

        const hash = values[0];
        const characterId = values[1];

        const apiHoyos = await api.hoyosBuilds(name, hash);

        if (!apiHoyos) {
            await interaction.editReply({ content: "User not found, either reconnect your account or check the account name you entered", components: [], embeds: [], files: [] });
            return;
        }

        const builds = apiHoyos.data as HoyoCharacters;

        const characterBuilds = builds[characterId];

        if(!characterBuilds || characterBuilds.length === 0) {
            await interaction.editReply({ content: "This character has no public builds", components: [], embeds: [], files: [] });
            return;
        }

        let components = getSelectsFromMessage(interaction.message.components, ["name_select_profile", "name_select_character"], values);

        if(Object.keys(characterBuilds).length === 1) {
            const build = characterBuilds[0];

            const image = await getBuffer(`https://cards.enka.network/u/${name}/${hash}/${characterId}/${build.id}/image`)

            const imgName = `${name}-${hash}-${characterId}-${build.id}.png`;

            const attachment = new AttachmentBuilder(image, { name: imgName });

            const embed = Embed()
                .setTitle(`Build: ${build.name || "Current"}`)
                .setImage(`attachment://${imgName}`)
                .setFooter({ text: `Related account: ${name}`});

            return await interaction.editReply({ embeds: [embed], components, files: [attachment] });
        }

        const row = new ActionRowBuilder<StringSelectMenuBuilder>();

        const selectMenu = new StringSelectMenuBuilder().setMaxValues(1).setMinValues(1)
            .setCustomId("name_select_build")
            .setPlaceholder("Select a build")
            .addOptions(
                characterBuilds.map(build => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(build.name || "Current")
                        .setValue(String(build.id))
                        .setDescription("Select this build")
                })
            )

        row.addComponents(selectMenu);

        components = [...components, row];

        await interaction.editReply({ embeds: [generateBuildEmbed(name)], components, files: [] });
    },
} as Command;
import {Command} from "../../../types/discord";
import {selectCharacter, selectUidCharacter} from "../../../utils/select-menus";
import {api, get} from "../../../utils/api";
import {HoyosRecord, NoProfile} from "../../../types/enka";
import {StringSelectMenuBuilder, ComponentType, ActionRowBuilder, BaseMessageOptions} from "discord.js";
import {getSelectsFromMessage, makeAllSelectsDisabled} from "../../../utils/misc";
import {generateBuildEmbed, generateUidBuildEmbed} from "../../../utils/embeds";

export default {
    custom_id: "uid_select_game",
    role: "SELECT_MENU",
    run: async (interaction) => {
        if (interaction.user.id !== interaction.message.interactionMetadata?.user.id) {
            return interaction.reply({
                content: "You can not interact with another users command",
                ephemeral: true,
            });
        }
        await interaction.deferUpdate();

        const uid = interaction.message.embeds[0].footer?.text.split(": ")[1];

        if(!uid) {
            await interaction.editReply({ content: "An error occurred, please try again", components: [], embeds: [], files: [] });
            return;
        }

        const game = interaction.values[0];

        if(game === "zenless") {
            return await interaction.editReply({ content: "The chosen game is not supported yet", components: [], embeds: [], files: [] });
        }

        const selectMenu = await selectUidCharacter(uid, game);

        if(!selectMenu) {
            await interaction.editReply({ content: "An error occurred, please try again", components: [], embeds: [], files: [] });
            return;
        }

        let components = getSelectsFromMessage(interaction.message.components, ["uid_select_game"], interaction.values);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        components = [...components, row];

        await interaction.editReply({ embeds: [generateUidBuildEmbed(uid)], components, files: [] });
    },
} as Command;
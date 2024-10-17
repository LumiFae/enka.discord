import {Command} from "../../../types/discord";
import {selectCharacter} from "../../../utils/select-menus";
import {api, get} from "../../../utils/api";
import {HoyosRecord, NoProfile} from "../../../types/enka";
import {StringSelectMenuBuilder, ComponentType, ActionRowBuilder, BaseMessageOptions} from "discord.js";
import {getSelectsFromMessage, makeAllSelectsDisabled} from "../../../utils/misc";

export default {
    custom_id: "name_select_profile",
    role: "SELECT_MENU",
    run: async (interaction) => {
        await interaction.deferUpdate();

        const name = interaction.message.embeds[0].footer?.text.split(": ")[1];

        if(!name) {
            await interaction.editReply({ content: "An error occurred, please try again", components: [], embeds: [] });
            return;
        }

        const profile = interaction.values[0];

        const apiHoyos = await api.hoyos(name);

        if (!apiHoyos) {
            await interaction.editReply({ content: "User not found, either reconnect your account or check the account name you entered", components: [], embeds: [] });
            return;
        }

        const hoyos = apiHoyos.data as HoyosRecord;

        const selectMenu = await selectCharacter(interaction, name, hoyos[profile]);

        if(!selectMenu) {
            await interaction.editReply({ content: "An error occurred, please try again", components: [], embeds: [] });
            return;
        }

        let components = getSelectsFromMessage(interaction.message.components, ["name_select_profile"], interaction.values);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        components = [...components, row];

        await interaction.editReply({ embeds: [interaction.message.embeds[0]], components });
    },
} as Command;
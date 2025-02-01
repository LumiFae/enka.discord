import {Command} from "../../../types/discord";
import {sameUser, setDefault} from "../../../utils/misc";
import {ActionRowBuilder, MessageFlagsBitField, StringSelectMenuBuilder} from "discord.js";
import API from "../../../utils/api";
import {HoyoType, HoyoType_T} from "../../../types/models";
import {selectUidCharacter} from "../../../utils/select-menus";
import {generateUidBuildEmbed} from "../../../utils/embeds";

export default {
    role: "SELECT_MENU",
    custom_id: "uid_select_game",
    run: async (interaction) => {
        if(!sameUser(interaction)) {
            return await interaction.reply({
                content: "You can not interact with another users command",
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const errorMsg = "An error occurred whilst trying to complete this. Try again."

        const uid = interaction.message.embeds[0].footer?.text;
        if(!uid) return await interaction.reply({
            content: errorMsg,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });

        const hoyo_type = Number(interaction.values[0]) as HoyoType_T;

        if(hoyo_type === HoyoType.ZZZ) {
            return await interaction.reply({
                content: "This game is unsupported until enka fully releases it.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
        }

        await interaction.deferUpdate();

        const data = await API.uid(Number(interaction.values[0]) as HoyoType_T, uid);
        if(!data) return await interaction.editReply({
            content: "This UID does not exist, or couldn't be fetched."
        })

        const rows = setDefault(interaction.message.components.slice(0,1), interaction.values[0])

        const selectMenu = selectUidCharacter(data);

        await interaction.editReply({
            files: [],
            embeds: [generateUidBuildEmbed(uid)],
            components: [...rows, new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)]
        })
    }
} satisfies Command;
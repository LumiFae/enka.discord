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
    run: async (interaction, locale) => {
        if(!sameUser(interaction)) {
            return await interaction.reply({
                content: locale.get(l => l.incorrect_interaction),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const errorMsg = locale.get(l => l.error)

        const uid = interaction.message.embeds[0].footer?.text;
        if(!uid) return await interaction.reply({
            content: errorMsg,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });

        const hoyo_type = Number(interaction.values[0]) as HoyoType_T;

        if(hoyo_type === HoyoType.ZZZ) {
            return await interaction.reply({
                content: locale.get(l => l.build.uid.unsupported_game),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
        }

        await interaction.deferUpdate();

        const data = await API.uid(Number(interaction.values[0]) as HoyoType_T, uid, locale);
        if(!data) return await interaction.editReply({
            content: locale.get(l => l.build.uid.no_found_uid)
        })

        const rows = setDefault(interaction.message.components.slice(0,1), interaction.values[0])

        const selectMenu = selectUidCharacter(data, locale);

        await interaction.editReply({
            files: [],
            embeds: [generateUidBuildEmbed(uid, locale)],
            components: [...rows, new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)]
        })
    }
} satisfies Command;
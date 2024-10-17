import {Command} from "../../../types/discord";
import {selectCharacter, selectUidCharacter} from "../../../utils/select-menus";
import {api, get, getBuffer, getGICharacters, getHSRCharacters} from "../../../utils/api";
import {HoyosRecord, NoProfile} from "../../../types/enka";
import {
    StringSelectMenuBuilder,
    ComponentType,
    ActionRowBuilder,
    BaseMessageOptions,
    AttachmentBuilder
} from "discord.js";
import {getSelectsFromMessage, getValues, makeAllSelectsDisabled} from "../../../utils/misc";
import {Embed, generateBuildEmbed, generateUidBuildEmbed} from "../../../utils/embeds";

export default {
    custom_id: "uid_select_character",
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

        const values = getValues(interaction, ["uid_select_game"]);

        const game = values[0];
        const characterId = interaction.values[0];

        const characters = game === "genshin" ? await getGICharacters() : await getHSRCharacters();
        const user = await api.uid(uid, game === "genshin" ? 0 : 1);
        if (!user) {
            await interaction.editReply({ content: "User not found, please try again", components: [], embeds: [], files: [] });
            return;
        }
        const username = 'detailInfo' in user.data ? user.data.detailInfo.nickname : user.data.playerInfo.nickname;
        const cardNumber = 'detailInfo' in user.data ? user.data.detailInfo.avatarDetailList.findIndex((avatar) => avatar.avatarId === Number(characterId)) : user.data.avatarInfoList.findIndex((avatar) => avatar.avatarId === Number(characterId));

        const components = getSelectsFromMessage(interaction.message.components, ["uid_select_game", "uid_select_character"], values);

        const url = `https://cards.enka.network/${game === "genshin" ? "u" : "hsr"}/${uid}/${cardNumber+1}/image`;

        const image = await getBuffer(url);

        const imgName = `${uid}-${characterId}.png`;

        const attachment = new AttachmentBuilder(image, { name: imgName });

        const character = characters.find(character => character.characterId === characterId);

        if(!character) {
            await interaction.editReply({ content: "Character not found, please try again", components: [], embeds: [], files: [] });
            return;
        }

        const embed = Embed()
            .setTitle(`${username}'s ${character.name} Build`)
            .setImage(`attachment://${imgName}`)
            .setFooter({ text: `Related UID: ${uid}` });

        await interaction.editReply({ embeds: [embed], components, files: [attachment] });
    },
} as Command;
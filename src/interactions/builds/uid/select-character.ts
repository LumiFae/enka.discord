import {Command} from "../../../types/discord";
import {api, characters, getBuffer} from "../../../utils/api";
import {
    AttachmentBuilder
} from "discord.js";
import {colors, getSelectsFromMessage, getValues} from "../../../utils/misc";
import {Embed} from "../../../utils/embeds";
import {GIUIDLookup, HSRUIDLookup, ZZZUIDLookup} from "../../../types/enka";

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

        const user = await api.uid(uid, game === "genshin" ? 0 : game === "honkai" ? 1 : 2);
        if (!user) {
            await interaction.editReply({ content: "User not found, please try again", components: [], embeds: [], files: [] });
            return;
        }
        let username: string;
        let cardNumber: number;
        if(game === "genshin") {
            const data = user.data as GIUIDLookup;
            username = data.playerInfo.nickname;
            cardNumber = data.avatarInfoList.findIndex((avatar) => avatar.avatarId === Number(characterId));
        } else if (game === "honkai") {
            const data = user.data as HSRUIDLookup;
            username = data.detailInfo.nickname;
            cardNumber = data.detailInfo.avatarDetailList.findIndex((avatar) => avatar.avatarId === Number(characterId));
        } else {
            const data = user.data as ZZZUIDLookup;
            username = data.PlayerInfo.SocialDetail.Nickname;
            cardNumber = data.PlayerInfo.ShowcaseDetail.AvatarList.findIndex(avatar => avatar.Id === Number(characterId))
        }

        const components = getSelectsFromMessage(interaction.message.components, ["uid_select_game", "uid_select_character"], values);

        const url = `https://cards.enka.network/${game === "genshin" ? "u" : game === "honkai" ? "hsr" : "zzz"}/${uid}/${cardNumber+1}/image`;

        const image = await getBuffer(url);

        const imgName = `${uid}-${characterId}.png`;

        const attachment = new AttachmentBuilder(image, { name: imgName });

        const character = await characters.getCharacterById(game === "genshin" ? 0 : game === "honkai" ? 1 : 2, characterId);

        if(!character) {
            await interaction.editReply({ content: "Character not found, please try again", components: [], embeds: [], files: [] });
            return;
        }

        const embed = Embed()
            .setTitle(`${username}'s ${character.name} Build`)
            .setImage(`attachment://${imgName}`)
            .setFooter({ text: `Related UID: ${uid}` })
            .setColor(colors[game === "genshin" ? `GI${character.element}` : `HSR${character.element}`]);

        await interaction.editReply({ embeds: [embed], components, files: [attachment] });
    },
} as Command;
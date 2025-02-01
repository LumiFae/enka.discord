import {Command} from "../../types/discord";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction, InteractionReplyOptions, MessageFlagsBitField,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js"
import {generateBuildEmbed, EmbedBuilder, generateUidBuildEmbed} from "../../utils/embeds";
import API from "../../utils/api";
import {db} from "../../utils/db";
import {eq} from "drizzle-orm";
import {users} from "../../schema";
import {getFromType} from "../../utils/misc";
import {selectCharacter} from "../../utils/select-menus";

export default {
    name: "build",
    role: "CHAT_INPUT",
    description: "Get a build by an enka.network profile.",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "uid",
            description: "Get a build by their UID",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "uid",
                    description: "The UID of the account",
                    required: true
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "profile",
            description: "Get a profile by their enka.network name",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The profile name",
                    required: false
                }
            ]
        }
    ],
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand()
        console.log(subcommand)
        switch (subcommand) {
            case "uid":
                return await uid(interaction);
            default:
                return await profile(interaction);
        }
    }
} satisfies Command;

async function profile(interaction: ChatInputCommandInteraction) {
    const userNotFound: InteractionReplyOptions = {
        content: "User not found, either connect your account or check the account name you entered",
        flags: MessageFlagsBitField.Flags.Ephemeral
    }
    const name = interaction.options.getString("name") ?? (await db.query.users.findFirst({where: eq(users.id, interaction.user.id)}))?.enka_name ?? null;
    if (!name) {
        await interaction.reply(userNotFound);
        return;
    }
    const hoyos = await API.hoyos(name)
    if (!hoyos) {
        await interaction.reply(userNotFound);
        return;
    }
    const arr = Object.values(hoyos).filter((h) => Object.keys(h.avatar_order ?? {}).length > 0);
    if (arr.length === 0) {
        await interaction.reply({
            content: "This user either has no publicly accessible profiles, or has no characters on any profiles.",
            flags: MessageFlagsBitField.Flags.Ephemeral
        });
        return;
    }
    await interaction.deferReply();

    const embed = generateBuildEmbed(name);

    const rows: ActionRowBuilder<StringSelectMenuBuilder>[] = []

    const selectMenu = new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId("select_profile")
        .setPlaceholder("Select a profile")
        .setOptions(arr.map(h =>
            new StringSelectMenuOptionBuilder()
                .setLabel('nickname' in h.player_info ? h.player_info.nickname : h.player_info.ProfileDetail.Nickname)
                .setValue(h.hash!)
                .setEmoji(getFromType(h.hoyo_type, "1296399185691676734", "1296399188313247774", "1334169563599863819"))
                .setDescription(getFromType(h.hoyo_type, "Genshin Impact", "Honkai: Star Rail", "Zenless Zone Zero"))
        ));

    if(arr.length === 1) {
        selectMenu.setDisabled(true);
        rows.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu))

        const selectCharacterSelect = selectCharacter(arr[0]);

        rows.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectCharacterSelect))
    } else {
        rows.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu))
    }

    await interaction.editReply({ embeds: [embed], components: rows })
}

async function uid(interaction: ChatInputCommandInteraction) {
    const selectMenu = new StringSelectMenuBuilder().setMaxValues(1).setMinValues(1)
        .setCustomId("uid_select_game")
        .setPlaceholder("Select a game")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Genshin Impact")
                .setValue("0")
                .setDescription("This UID is a Genshin Impact UID")
                .setEmoji("1296399185691676734"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Honkai: Star Rail")
                .setValue("1")
                .setDescription("This UID is a Honkai: Star Rail UID")
                .setEmoji("1296399188313247774"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Zenless Zone Zero (Coming Soon)")
                .setValue("2")
                .setDescription("This UID is a Zenless Zone Zero UID")
                .setEmoji("1334169563599863819")
        )

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return await interaction.reply({ embeds: [generateUidBuildEmbed(interaction.options.getString("uid", true))], components: [row] })
}
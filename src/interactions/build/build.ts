import {Command} from "../../types/discord";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType, AttachmentBuilder, AutocompleteInteraction,
    ChatInputCommandInteraction, ComponentType, InteractionReplyOptions, MessageFlagsBitField,
    StringSelectMenuBuilder,
} from "discord.js"
import {EmbedBuilder, generateUidBuildEmbed, generateCardEmbed} from "../../utils/embeds";
import API from "../../utils/api";
import {db} from "../../utils/db";
import {eq} from "drizzle-orm";
import {users} from "../../schema";
import {getBuffer, getCharacter, getFromType} from "../../utils/misc";
import {selectUidCharacter} from "../../utils/select-menus";
import Locales from "../../utils/locales";
import {HoyoType_T} from "../../types/models";

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
                },
                {
                    type: ApplicationCommandOptionType.Number,
                    name: "game",
                    description: "The game",
                    required: true,
                    choices: [
                        {
                            name: "Genshin Impact",
                            value: 0,
                        },
                        {
                            name: "Honkai: Star Rail",
                            value: 1
                        },
                        {
                            name: "Zenless Zone Zero",
                            value: 2
                        }
                    ]
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
                    name: "profile",
                    description: "The name of the profile",
                    autocomplete: true,
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "character",
                    description: "The character name",
                    autocomplete: true,
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "build",
                    description: "The build name",
                    autocomplete: true,
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the enka.network account",
                    required: false
                }
            ]
        }
    ],
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction, locale) => {
        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case "uid":
                return await uid(interaction, locale);
            default:
                return await profile(interaction, locale);
        }
    },
    autocomplete: async (interaction, locale) => {
        const focused = interaction.options.getFocused(true);
        switch (focused.name) {
            case 'profile': {
                const name = await getName(interaction);
                if(!name) return [];
                const hoyos = await API.hoyos(name);
                if(!hoyos) return [];
                return Object.values(hoyos).filter(h => h.name.includes(focused.value) && h.hash).map(h => ({
                    name: `${h.name} | ${h.gameName}`,
                    value: h.hash!
                }))
            }
            case 'character': {
                const name = await getName(interaction);
                if(!name) return [];
                const hoyo = interaction.options.getString("profile", true);
                const builds = await API.builds(name, hoyo);
                if(!builds) return [];
                const hoyoType = Object.values(builds)[0]?.[0].hoyo_type;
                if(hoyoType === undefined) return [];
                const characters = Object.keys(builds).map(av => getCharacter(locale, hoyoType, av)).filter(character => character.name.includes(focused.value));
                return characters.map(char => ({
                    name: char.name,
                    value: char.id
                }))
            }
            case 'build': {
                const name = await getName(interaction);
                if(!name) return [];
                const hoyo = interaction.options.getString("profile", true);
                const characterId = interaction.options.getString("character", true);
                const character = await API.character(name, hoyo, characterId);
                if(!character) return [];
                return character.filter(build => build.name.includes(focused.value)).map(build => ({
                    name: build.name || locale.get(lang => lang.build.live_build),
                    value: String(build.id)
                }))
            }
        }
        return [];
    }
} satisfies Command;

async function profile(interaction: ChatInputCommandInteraction, locale: Locales) {
    const userNotFound: InteractionReplyOptions = {
        content: locale.get(l => l.user_not_found),
        flags: MessageFlagsBitField.Flags.Ephemeral
    }
    const name = interaction.options.getString("name") ?? (await db.query.users.findFirst({where: eq(users.id, interaction.user.id)}))?.enka_name ?? null;
    if (!name) {
        await interaction.reply(userNotFound);
        return;
    }

    await interaction.deferReply();

    const profile = interaction.options.getString("profile", true);
    const character = interaction.options.getString("character", true);
    const build = interaction.options.getString("build", true);

    const data = await API.build(name, profile, character, build);

    if(!data) {
        await interaction.editReply(locale.get(lang => lang.build.name.no_profiles))
        return;
    }

    const [embed, attachment] = await generateCardEmbed(name, profile, data, locale);

    await interaction.editReply({
        embeds: [embed],
        files: [attachment]
    })
}

async function uid(interaction: ChatInputCommandInteraction, locale: Locales) {
    const hoyoType = interaction.options.getNumber("game", true) as HoyoType_T;

    await interaction.deferReply();

    const uid = interaction.options.getString("uid", true)

    const data = await API.uid(hoyoType, uid, locale)

    if (!data) {
        await interaction.editReply(locale.get(lang => lang.build.uid.no_found_uid))
        return;
    }

    const comps = [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectUidCharacter(data, locale))]

    const msg = await interaction.editReply({
        content: '',
        files: [],
        embeds: [generateUidBuildEmbed(data.uid, locale)],
        components: comps
    })

    let waiting = true;

    while(waiting) {
        try {
            const select = await msg.awaitMessageComponent({
                filter: (i) => {
                    i.deferUpdate();
                    return i.user.id === interaction.user.id
                },
                componentType: ComponentType.StringSelect,
                time: 60_000
            });

            const characterId = select.values[0];

            const url = `https://cards.enka.network/${getFromType(hoyoType, "u", "hsr", "zzz")}/${uid}/${characterId}/image?lang=${locale.locale}`

            const image = await getBuffer(url);

            const imgName = `${uid}-${characterId}.png`;

            const attachment = new AttachmentBuilder(image, {name: imgName});

            const character = data.getCharacter(characterId);

            if (!character) return await interaction.editReply({
                content: locale.get(lang => lang.error)
            })

            const embed = new EmbedBuilder()
                .setTitle(locale.get(l => l.build.uid.character_embed_title).replace("{nickname}", data.nickname).replace("{name}", character.name))
                .setColor(character.colorFromElement)
                .setImage(`attachment://${imgName}`)

            await interaction.editReply({
                content: '',
                files: [attachment],
                embeds: [embed],
                components: comps
            })
        } catch(err) {
            waiting = false;
        }
    }
}

async function getName(interaction: AutocompleteInteraction | ChatInputCommandInteraction) {
    return interaction.options.getString("name") ?? (await db.query.users.findFirst({where: eq(users.id, interaction.user.id)}))?.enka_name ?? null
}
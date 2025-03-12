import {Command} from "../../types/discord";
import {ApplicationCommandOptionType, MessageFlagsBitField} from "discord.js";
import languages from '../../../locales/languages.json';

export default {
    name: "config",
    role: "CHAT_INPUT",
    description: "Configure the bot to your needs.",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "language",
            description: "Change the language of the bot.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "language",
                    description: "The language you want to set.",
                    required: true,
                    choices: [
                        {
                            name: "Automatic",
                            value: "Auto"
                        },
                        ...languages.map(l =>
                            ({ name: l.name, value: l.code })
                        )
                    ]
                }
            ]
        }
    ],
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction, locale) => {
        const subcommand = interaction.options.getSubcommand();
        switch(subcommand) {
            case "language":
                const language = interaction.options.getString("language", true);
                await locale.setLanguage(interaction.user.id, language === "Auto" ? interaction.locale : language, language === "Auto");
                await interaction.reply({
                    content: locale.get(l => language !== "Auto" ? l.config.language.set : l.config.language.set_auto),
                    flags: MessageFlagsBitField.Flags.Ephemeral
                });
                break;
        }
    }
} satisfies Command;
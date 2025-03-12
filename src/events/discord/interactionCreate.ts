import {Client, Interaction, MessageFlagsBitField} from 'discord.js';
import { commands } from '../..';
import {db} from "../../utils/db";
import {eq} from "drizzle-orm";
import {users} from "../../schema";
import Locales, {getFromInteraction} from "../../utils/locales";

export default async function (client: Client) {
    client.on('interactionCreate', async (interaction) => {
        let finder: string;
        if (!('commandName' in interaction)) {
            finder = interaction.customId;
        } else {
            finder = interaction.commandName;
        }
        const command = commands.get(finder);
        if (!command) return;
        console.log(`Executing interaction ${finder}...`);
        try {
            if(interaction.isAutocomplete() && command.role === "CHAT_INPUT") {
                command.autocomplete ? await command.autocomplete(interaction) : console.error("Couldn't complete autocomplete interaction");
                return;
            }
            await command.run(
                interaction as never,
                Locales.get((await db.query.users.findFirst({where: eq(users.id, interaction.user.id)}))?.locale ?? getFromInteraction(interaction))
            );
            console.log(`Interaction ${finder} executed successfully!`);
        } catch (error) {
            console.log(`Error while executing interaction ${finder}:`);
            console.error(error);
            if (interaction.isCommand() || interaction.isRepliable()) {
                if (interaction.deferred || interaction.replied)
                    await interaction.editReply({
                        content:
                            'There was an error while executing this command!',
                    });
                else
                    await interaction.reply({
                        content:
                            'There was an error while executing this command!',
                        flags: MessageFlagsBitField.Flags.Ephemeral
                    });
            }
        }
    });
}

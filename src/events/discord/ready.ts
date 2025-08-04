import { Client, REST, Routes } from "discord.js";
import { commands } from "../..";
import { readdirSync } from "fs";
import path from "path";
import { Command, CommandNoRun } from "../../types/discord";

export default async function (client: Client) {
    client.on("ready", async () => {
        const commandFiles = readdirSync('./src/interactions', { recursive: true }).filter(file => !(file instanceof Buffer) && file.endsWith('.ts'));
        const loadedCommands: CommandNoRun[] = [];
        for (const file of commandFiles) {
            const command = (
                await import(`../../interactions/${file}`)
            ).default as Command & { type?: number };
            if (
                commands.get(
                    'name' in command ? command.name : command.custom_id,
                )
            )
                throw Error(
                    `Duplicate command name or custom_id (${file})`,
                );
            commands.set(
                'name' in command ? command.name : command.custom_id,
                command as Command,
            );
            if ('name' in command) {
                if (command.role !== 'CHAT_INPUT')
                    command.type =
                        command.role === 'MESSAGE_CONTEXT_MENU' ? 3 : 2;
                const { run, default_member_permissions, ...rest } =
                    command;
                const add: CommandNoRun & {
                    default_member_permissions?: string;
                } = rest;
                if (default_member_permissions)
                    add.default_member_permissions =
                        default_member_permissions.toString();
                loadedCommands.push(add);
            }
        }
        const rest = new REST({ version: "10" }).setToken(
            process.env.TOKEN as string,
        );
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            { body: loadedCommands },
        );
        console.log(
            `Logged in as ${client.user?.tag}! Loaded ${commands.size} interactions.`,
        );
    });
}

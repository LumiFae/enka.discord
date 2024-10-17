import { readdirSync } from "fs";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { Command } from "./types/discord";
dotenv.config();

if (!process.env.TOKEN) throw Error("You need to provide a token");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const commands = new Map<string, Command>();

const eventFolders = readdirSync("./src/events");
for (const folder of eventFolders) {
    switch (folder) {
        case "discord": {
            readdirSync(`./src/events/${folder}`).forEach(
                (file) => {
                    import(`./events/${folder}/${file}`).then((event) => {
                        event.default(client);
                    });
                },
            );
            break;
        }
        default: {
            readdirSync(`.src/events/${folder}`).forEach(
                (file) => {
                    import(`./events/${folder}/${file}`).then((event) => {
                        event.default();
                    });
                },
            );
            break;
        }
    }
}

client.login(process.env.TOKEN);

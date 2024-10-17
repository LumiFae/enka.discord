import { ShardingManager } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.TOKEN) throw Error("You need to provide a token");

const manager = new ShardingManager("./dist/index.js", {
    token: process.env.TOKEN as string,
});

manager.spawn();

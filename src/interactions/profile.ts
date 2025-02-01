import { Command } from "../types/discord";
import {db} from "../utils/db";
import {eq} from "drizzle-orm";
import {users} from "../schema";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import API from "../utils/api";
import {EmbedBuilder} from "../utils/embeds";

export default {
    name: "profile",
    role: "CHAT_INPUT",
    description: "Check out your own profile or someone else's",
    options: [
        {
            type: 3,
            name: "name",
            description: "The name of the account you wish to get the profile of",
            required: false,
        },
    ],
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction) =>  {
        const user = interaction.options.getString("name") || await db.query.users.findFirst({ where: eq(users.id, interaction.user.id) }).then(user => user?.enka_name);
        if (!user) {
            await interaction.reply({ content: "User not found, either connect your account or check the account name you entered", ephemeral: true });
            return;
        }

        const apiProfile = await API.profile(user);

        if (!apiProfile) {
            await interaction.reply({ content: "User not found, either reconnect your account or check the account name you entered", ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${apiProfile.username}'s profile`)

        if(apiProfile.profile.bio) {
            embed.setDescription(apiProfile.profile.bio);
        }
        if(apiProfile.profile.level > 0) {
            embed.addFields({
                    name: "Patreon Tier",
                    value: String(apiProfile.profile.level),
                })
        }
        if(apiProfile.profile.avatar && apiProfile.profile.avatar.startsWith("http")) {
            embed.setThumbnail(apiProfile.profile.avatar);
        }

        const profileButton = new ButtonBuilder()
            .setLabel("View profile")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://enka.network/u/${apiProfile.username}/`)

        await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(profileButton)] });
    },
} satisfies Command;

import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {get} from "../../../utils/api";
import {NoProfile, ProfileInfo} from "../../../types/enka";
import {Embed} from "../../../utils/embeds";
import {db} from "../../../utils/db";
import {users} from "../../../schema";

export default {
    custom_id: "account_connect",
    role: "BUTTON",
    run: async (interaction) => {
        await interaction.deferUpdate();

        const code = userVerifCodes.get(interaction.user.id);
        if (!code) {
            await interaction.update({ content: "Your code either expired or there was an error, try again", embeds: [], components: [] });
            return;
        }
        const response = await get<ProfileInfo | NoProfile>(`https://enka.network/api/profile/${code.name}/?format=json`).catch(() => null);
        if (!response || ('detail' in response.data && response.data.detail === "Not found.")) {
            await interaction.update({ content: "User not found, try again", embeds: [], components: [] });
            return;
        }

        const profile = response.data as ProfileInfo;

        if(profile.profile.bio.includes(code.code)) {
            try {
                await db.insert(users).values({
                    id: interaction.user.id,
                    enka_name: code.name
                }).onConflictDoUpdate({target: users.id, set: {enka_name: code.name}}).execute();
                await interaction.update({content: "Account connected successfully", embeds: [], components: []});
            } catch (e: unknown) {
                await interaction.update({content: "An error occurred while connecting your account, please try again", embeds: [], components: []});
            }
        } else {
            const embed = Embed()
                .setTitle("Incorrect code")
                .setDescription("The code you entered is incorrect, please try again. Your code is: " + code.code)
            await interaction.update({ embeds: [embed] });
        }
    },
} satisfies Command;

import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {get} from "../../../utils/api";
import {NoProfile, ProfileInfo} from "../../../types/enka";

export default {
    custom_id: "account_connect_cancel",
    role: "BUTTON",
    run: async (interaction) => {
        userVerifCodes.delete(interaction.user.id);
        await interaction.editReply({ content: "Connection cancelled", embeds: [], components: [] });
    },
} satisfies Command;

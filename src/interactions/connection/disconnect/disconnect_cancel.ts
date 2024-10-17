import { Command } from "../../../types/discord";
import {userVerifCodes} from "../../../utils/temp";
import {get} from "../../../utils/api";
import {NoProfile, ProfileInfo} from "../../../types/enka";
import {Embed} from "../../../utils/embeds";
import {db} from "../../../utils/db";
import {users} from "../../../schema";
import {eq} from "drizzle-orm";

export default {
    custom_id: "account_disconnect_cancel",
    role: "BUTTON",
    run: async (interaction) => {
        await interaction.editReply({ content: "Disconnect cancelled", embeds: [], components: [] });
    },
} satisfies Command;

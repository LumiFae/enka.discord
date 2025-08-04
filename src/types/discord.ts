import type {
    AnySelectMenuInteraction,
    ApplicationCommandOption,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    UserContextMenuCommandInteraction,
    StringSelectMenuInteraction,
} from "discord.js";
import Locales from "../utils/locales";

export type Command =
    | {
          role: "CHAT_INPUT";
          run: (interaction: ChatInputCommandInteraction, locale: Locales) => unknown;
          name: string;
          name_localizations?: Record<string, string>;
          description: string;
          description_localizations?: Record<string, string>;
          options?: ApplicationCommandOption[];
          default_member_permissions?: bigint;
          nsfw?: boolean;
          integration_types?: number[];
          contexts?: number[];
          autocomplete?: (interaction: AutocompleteInteraction, locale: Locales) => Promise<{ name: string; value: string | number }[]>;
      }
    | {
          role: "MESSAGE_CONTEXT_MENU";
          run: (interaction: MessageContextMenuCommandInteraction, locale: Locales) => unknown;
          name: string;
          name_localizations?: Record<string, string>;
          description_localizations?: Record<string, string>;
          options?: ApplicationCommandOption[];
          default_member_permissions?: bigint;
          nsfw?: boolean;
          integration_types?: number[];
          contexts?: number[];
      }
    | {
          role: "USER_CONTEXT_MENU";
          run: (interaction: UserContextMenuCommandInteraction, locale: Locales) => unknown;
          name: string;
          name_localizations?: Record<string, string>;
          description_localizations?: Record<string, string>;
          options?: ApplicationCommandOption[];
          default_member_permissions?: bigint;
          nsfw?: boolean;
          integration_types?: number[];
          contexts?: number[];
      }
    | {
          role: "SELECT_MENU";
          custom_id: string;
          run: (interaction: StringSelectMenuInteraction, locale: Locales) => unknown;
      }
    | {
          role: "BUTTON";
          custom_id: string;
          run: (interaction: ButtonInteraction, locale: Locales) => unknown;
      }
    | {
          role: "MODAL_SUBMIT";
          custom_id: string;
          run: (interaction: ModalSubmitInteraction, locale: Locales) => unknown;
      }

export type CommandNoRun = Omit<Command, "run">;
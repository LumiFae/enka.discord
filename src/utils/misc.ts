import {
    ActionRow,
    ActionRowBuilder, BaseMessageOptions, CacheType,
    ComponentType,
    EmbedBuilder,
    MessageActionRowComponent,
    StringSelectMenuBuilder, StringSelectMenuInteraction
} from "discord.js";

export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function generateRandomCapitalString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function makeAllSelectsDisabled(components: ActionRow<MessageActionRowComponent>[], values: string[]){
    let rows: BaseMessageOptions["components"] = [];
    let valueIndex = 0;
    for(const row of components){
        const r: ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder();
        for(const component of row.components){
            if(component.type === ComponentType.StringSelect){
                const comp = StringSelectMenuBuilder.from(component);
                comp.setDisabled(true);
                comp.options.find(option => option.data.value === values[valueIndex])?.setDefault(true);
                valueIndex++;
                r.addComponents(comp);
            }
        }
        rows = [...rows, r];
    }
    return rows;
}

export function getSelectsFromMessage(components: ActionRow<MessageActionRowComponent>[], custom_ids: string[], values: string[]) {
    let rows: BaseMessageOptions["components"] = [];
    let valueIndex = 0;
    for(const row of components){
        const r: ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder();
        for(const component of row.components){
            if(!component.customId) continue;
            if(custom_ids.includes(component.customId) && component.type === ComponentType.StringSelect){
                const comp = StringSelectMenuBuilder.from(component);
                comp.options.forEach(option => option.setDefault(false));
                comp.options.find(option => option.data.value === values[valueIndex])?.setDefault(true).setValue(values[valueIndex]);
                valueIndex++;
                comp.setOptions(comp.options)
                r.addComponents(comp);
            }
        }
        rows = [...rows, r];
    }
    return rows;
}

export function getPastValues(interaction: StringSelectMenuInteraction<CacheType>){
    return interaction.message.components.map(row => {
        return row.components.map(component => {
            if(component.type === ComponentType.StringSelect){
                const options = component.options.filter(option => option.default === true);
                return options.map(option => option.value);
            }
        })
    }).flat().filter((value): value is string[] => value !== undefined).flat();
}

export function getValues(interaction: StringSelectMenuInteraction<CacheType>){
    return [...getPastValues(interaction), ...interaction.values];
}
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

export const emojiIds: Record<string, string> = {
    "GIElectric": "1296433521564454972",
    "GIFire": "1296433519903375400",
    "GIGrass": "1296433518707998771",
    "GIIce": "1296433516250140726",
    "GIRock": "1296433515277058069",
    "GIWater": "1296433513955856405",
    "GIWind": "1296433512391508028",
    "HSRFire": "1296433551029305404",
    "HSRIce": "1296433552308834324",
    "HSRImaginary": "1296433558193180672",
    "HSRPhysical": "1296433549792247882",
    "HSRQuantum": "1296433556893204580",
    "HSRThunder": "1296433553923375135",
    "HSRWind": "1296433555022282883"
};
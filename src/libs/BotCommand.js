import { SlashCommandBuilder } from "discord.js";

export default class BotCommand {
    constructor(name, description, enabled = true) {
        this.name = name;
        this.enabled = enabled;
        this.data = new SlashCommandBuilder();
        this.data.setName(name);
        this.data.setDescription(description);
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.data.description;
    }

    isEnabled() {
        return this.enabled;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    async execute(Discord, client, interaction) {
        interaction.reply({ content: "This Command is not Implemented Yet!", ephemeral: true })
    }

}
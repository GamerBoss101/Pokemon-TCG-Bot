
export default class BotAction {
    constructor(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    async execute(Discord, client, interaction) {
        interaction.reply({ content: "This Action is not Implemented Yet!", ephemeral: true });
    }
}
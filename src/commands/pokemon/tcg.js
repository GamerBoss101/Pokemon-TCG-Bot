import BotCommand from "../../libs/BotCommand";

import ms from "ms";

export default class StatusCommand extends BotCommand {
    constructor() {
        super("tcg", "Pokemon TCG Command");

        this.data.addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Get a Pokemon TCG card")
                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription("The name of the card")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("subtype")
                        .setDescription("The subtype of the card")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("type")
                        .setDescription("The type of the card")
                        .setRequired(false)
                )
        );

        this.data.addSubcommand(subcommand =>
            subcommand
                .setName("card")
                .setDescription("Get's a Pokemon TCG card using the card ID")
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("The ID of the card")
                        .setRequired(true)
                )
        );
    }

    async searchCard(Discord, client, interaction) {
        
        let name = interaction.options.getString("name");

        let subtype = interaction.options.getString("subtype");
        let type = interaction.options.getString("type");
        
        let cards = await client.tcg.cards.searchByName(name, subtype, type);

        if(cards.length === 0) return interaction.reply({ content: "No cards found", ephemeral: true });

        cards = cards.reverse();

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(true),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-next')
                .setLabel('Next')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(false)
        );

        let embed = client.util.buildEmbed(client.formatter.format("./responses/tcg/cardview.yaml", cards[0]));

        interaction.reply({ embeds: [embed], components: [row] }).then((msg) => {
            client.commandInfo.set(msg.id, cards);

            setTimeout(async() => {
                await interaction.editReply({ content: "This message is now expired.", components: [] });
                client.commandInfo.delete(msg.id);
            }, ms("20s"));
        });
    }

    async getCard(Discord, client, interaction) {
        let id = interaction.options.getString("id");

        let card = await client.tcg.cards.getCard(id);

        if(!card) return interaction.reply({ content: "No card found", ephemeral: true });

        let embed = client.util.buildEmbed(client.formatter.format("./responses/tcg/cardview.yaml", card));

        interaction.reply({ embeds: [embed] });
    }

    async execute(Discord, client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch(subcommand) {
            case "search":
                this.searchCard(Discord, client, interaction);
                break;
            case "card":
                this.getCard(Discord, client, interaction);
                break;
            default:
                interaction.reply({ content: "Invalid subcommand", ephemeral: true });
                break;
        }
    }
}
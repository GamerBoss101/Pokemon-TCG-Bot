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

        this.data.addSubcommand(subcommand =>
            subcommand
                .setName("listsets")
                .setDescription("List all Pokemon TCG sets")
        );

        this.data.addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Get a Pokemon TCG set")
                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription("The name of the set")
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
                .setCustomId('btn-tcg-card-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(true),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-card-info')
                .setLabel('Info')
                .setStyle(Discord.ButtonStyle.Primary)
                .setDisabled(false),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-card-next')
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
            }, ms("1m"));
        });
    }

    async getCard(Discord, client, interaction) {
        let id = interaction.options.getString("id");

        let card = await client.tcg.cards.getCard(id);

        if(!card) return interaction.reply({ content: "No card found", ephemeral: true });

        let embed = client.util.buildEmbed(client.formatter.format("./responses/tcg/cardinfo.yaml", card));

        interaction.reply({ embeds: [embed] });
    }

    async listSets(Discord, client, interaction) {
        let sets = await client.tcg.sets.all();

        if(sets.length === 0) return interaction.reply({ content: "No sets found", ephemeral: true });

        let setFields = sets.reverse().map(set => {
            return {
                name: set.name,
                value: set.releaseDate,
                inline: true
            }
        });

        setFields = setFields.slice(0, 12);

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-set-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(true),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-set-next')
                .setLabel('Next')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(false)
        );

        let embed = new Discord.EmbedBuilder()
        .setTitle("Pokemon TCG Sets")
        .setColor("Random")
        .addFields(setFields)
        .setFooter({ text: "12" })
        .setTimestamp();

        interaction.reply({ embeds: [embed], components: [row] }).then((msg) => {
            client.commandInfo.set(msg.id, sets);

            setTimeout(async() => {
                await interaction.editReply({ content: "This message is now expired.", components: [] });
                client.commandInfo.delete(msg.id);
            }, ms("1m"));
        });
    }

    async getSet(Discord, client, interaction) {
        let name = interaction.options.getString("name");

        let set = await client.tcg.sets.getSetByName(name);

        if(!set) return interaction.reply({ content: "No set found", ephemeral: true });

        console.log(set);

        let embed = client.util.buildEmbed(client.formatter.format("./responses/tcg/setinfo.yaml", set));

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
            case "listsets":
                this.listSets(Discord, client, interaction);
                break;
            case "set":
                this.getSet(Discord, client, interaction);
                break;
            default:
                interaction.reply({ content: "Invalid subcommand", ephemeral: true });
                break;
        }
    }
}
import BotAction from "../libs/BotAction";

export default class TCGSearch extends BotAction {
    constructor() {
        super("btn-tcg");
    }

    getIndex(cardID, cards) {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === cardID) {
                return i;
            }
        }

    }

    async nextBtn(Discord, client, interaction) {
        let cards = client.commandInfo.get(interaction.message.interaction.id);
        let cardID = interaction.message.embeds[0].footer.text;
        let index = this.getIndex(cardID, cards);

        if (index === cards.length - 1) return;

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(index-- == 0),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-next')
                .setLabel('Next')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(index++ == cards.length - 1)
        );

        let embed = client.util.buildEmbed(client.formatter.format("./responses/tcg/cardview.yaml", cards[index + 1]));

        interaction.message.edit({ embeds: [embed], components: [row] }).then(async(msg) => {
            interaction.deleteReply();
        });
    }

    async prevBtn(Discord, client, interaction) {
        let cards = client.commandInfo.get(interaction.message.interaction.id);
        let cardID = interaction.message.embeds[0].footer.text;
        let index = this.getIndex(cardID, cards);

        if (index === 0) return;

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(index-- == 0),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-next')
                .setLabel('Next')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(index++ == cards.length - 1)
        );

        let embed = client.util.buildEmbed(client.formatter.format("./responses/tcg/cardview.yaml", cards[index - 1]));

        interaction.message.edit({ embeds: [embed], components: [row] }).then(async(msg) => {
            interaction.deleteReply();
        });
    }

    async execute(Discord, client, interaction) {
        await interaction.reply({ content: "⏳ One Moment Please. . . ", ephemeral: true });

        let action = interaction.customId.split("-")[2];

        switch (action) {
            case "next":
                this.nextBtn(Discord, client, interaction);
                break;
            case "prev":
                this.prevBtn(Discord, client, interaction);
                break;
            default:
                break;
        }
        
    }
}
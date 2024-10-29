import BotAction from "../libs/BotAction";

export default class TCGSet extends BotAction {
    constructor() {
        super("btn-tcg-set");
    }

    checkIfNextBtnDisabled(index, sets) {
        return index++ == sets.length - 1;
    }

    checkIfPrevBtnDisabled(index) {
        return index-- <= 0;
    }

    async nextBtn(Discord, client, interaction) {
        let sets = client.commandInfo.get(interaction.message.interaction.id);
        if (!sets) {
            interaction.message.edit({ content: "This message is now expired.", components: [] });
            return;
        }

        let index = parseInt(interaction.message.embeds[0].footer.text);
        if (index === sets.length - 1) return;

        let setFields = sets.reverse().map(set => {
            return {
                name: set.name,
                value: set.releaseDate,
                inline: true
            }
        });

        setFields = setFields.slice(index + 1, index + 13);

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-set-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(this.checkIfPrevBtnDisabled(index)),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-set-next')
                .setLabel('Next')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(this.checkIfNextBtnDisabled(index, sets))
        );

        let embed = new Discord.EmbedBuilder()
        .setTitle("Pokemon TCG Sets")
        .setColor("Random")
        .addFields(setFields)
        .setFooter({ text: `${index + 13}` })
        .setTimestamp();

        interaction.message.edit({ embeds: [embed], components: [row] }).then(async(msg) => {
            interaction.deleteReply();
        });
    }

    async prevBtn(Discord, client, interaction) {
        let sets = client.commandInfo.get(interaction.message.interaction.id);
        if (!sets) {
            interaction.message.edit({ content: "This message is now expired.", components: [] });
            return;
        }

        let index = parseInt(interaction.message.embeds[0].footer.text);
        if (index === 0) return;

        let setFields = sets.reverse().map(set => {
            return {
                name: set.name,
                value: set.releaseDate,
                inline: true
            }
        });

        setFields = setFields.slice(index - 13, index - 1);

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-set-prev')
                .setLabel('Previous')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(this.checkIfPrevBtnDisabled(index)),
            new Discord.ButtonBuilder()
                .setCustomId('btn-tcg-set-next')
                .setLabel('Next')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(this.checkIfNextBtnDisabled(index, sets))
        );

        let embed = new Discord.EmbedBuilder()
        .setTitle("Pokemon TCG Sets")
        .setColor("Random")
        .addFields(setFields)
        .setFooter({ text: `${index-13}` })
        .setTimestamp();

        interaction.message.edit({ embeds: [embed], components: [row] }).then(async(msg) => {
            interaction.deleteReply();
        });
    }

    async execute(Discord, client, interaction) {
        await interaction.reply({ content: "⏳ One Moment Please. . . ", ephemeral: true });

        let action = interaction.customId.split("-")[3];

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
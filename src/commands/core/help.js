import BotCommand from "../../libs/BotCommand";

export default class HelpCommand extends BotCommand {
    constructor() {
        super("help", "Bot Help");
    }

    async execute(Discord, client, interaction) {

        const Embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
        .setDescription(
            "Here are the commands you can use:\n" +
            "1. `/tcg search <name> <supertype> <type>`\n" +
            "2. `/tcg card <card_id>`\n" +
            "3. `/status`"
        )
        .setTimestamp();

        return interaction.reply({ embeds: [Embed], ephemeral: true });
    }
}
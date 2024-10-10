import BotCommand from "../../libs/BotCommand";

export default class StatusCommand extends BotCommand {
    constructor() {
        super("status", "Bot Status Command");
    }

    async execute(Discord, client, interaction) {

        let totalSeconds = ((client.uptime || 0) / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        const Embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
        .setDescription(
            "Version: `" + `1.0.0` + "`\n" +
            "💻 **Client Latency**: `" + `${Date.now() - interaction.createdTimestamp}ms` + "`\n" +
            "📊 **API Latency**: `" + `${Math.round(client.ws.ping)}ms` + "`\n" +
            "📶 **Ping**: `" + `${client.ws.ping}ms` + "`\n" +
            ":file_cabinet:**Memory**: `" + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb` + "`"
        )   
        .addFields({ name: "Uptime", value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: false })
        .setTimestamp();
        
        return interaction.reply({ embeds: [Embed], ephemeral: true });

    }
}
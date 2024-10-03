import Discord from "discord.js";
import fs from "fs";
import path from "path";
import BotClient from "./libs/BotClient.js";

export const client = new BotClient({ 
    partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.DirectMessages
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

(async() => {
    fs.readdirSync(path.join(__dirname, "./handlers")).forEach( async(file) => {
        await (await import(path.join(__dirname, `./handlers/${file}`))).default(Discord, client);
    });
})();

client.login(process.env.BOT_CLIENT_TOKEN)
.then(() => console.log("Bot Logged IN")).catch(() => console.log(new Error("Invalid Discord Bot Token Provided!")));
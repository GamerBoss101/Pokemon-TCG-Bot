import fs from "fs";
import path from "path";

import { REST, Routes } from "discord.js";

const rest = new REST({ version: '10' }).setToken(process.env.BOT_CLIENT_TOKEN);

export default (Discord, client) => {
    fs.readdirSync(path.join(__dirname, "../commands")).forEach((dir) => {
        fs.readdirSync(path.join(__dirname, `../commands/${dir}`)).forEach( async(file) => {
            let command = new (await( await import(path.join(__dirname, `../commands/${dir}/${file}`)))).default();
            client.commands.set(command.name, command);
        });       
    });
}

export async function post(client) {
    let botCommands = [];
    client.commands.forEach((value, key) => {
        botCommands.push(value.data);
    });

    try {
        client.guilds.cache.forEach(async (guild) => {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guild.id),
                { body: botCommands }
            );
            client.logger.log(`Posted (/) Commands for ${guild.name}`);
        });
    } catch (error) {
        client.logger.error(error);
    }
}

export async function postToGuild(guild) {
    let botCommands = [];
    client.commands.forEach((value, key) => {
        botCommands.push(value.data);
    });

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body: botCommands }
        );
        client.logger.log(`Posted (/) Commands for ${guild.name}`);
    } catch (error) {
        client.logger.error(error);
    }
}
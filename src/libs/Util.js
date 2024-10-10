import { EmbedBuilder } from "discord.js";

import { setTimeout } from "timers/promises";

function getRoles(array, key, value) {
    let result;
    array.forEach((element) => {
        if(element[key] == value) {
            result = element.roles;
        }
    })
    return result;
}

function changeProperty(object, ...changes) {
    changes.forEach((change) => {
        object[change.key] = change.value;
    });
    return object;
}

async function getMemberByTag(client, targetServer, username) {
    let server = await client.guilds.fetch(targetServer);
    let member = await server.members.fetch();
    member = member.find((member) => member.user.username == username.trim());
    return member;
}

function parseInteraction(interaction) {
    return { user: interaction.user, guild: interaction.guild, channel: interaction.channel };
}

function getIntfromString(inputString) {
    let result = "";
    inputString.split("").forEach((char) => {
        if(parseInt(char) == 0 || parseInt(char) < 10) result += char;
    });
    return result;
}

function buildEmbed(obj) {
    let embed = new EmbedBuilder()
    if(obj.title) embed.setTitle(obj.title);
    if(obj.description) embed.setDescription(obj.description);
    if(obj.color) embed.setColor(obj.color);
    if(obj.url) embed.setURL(obj.url);
    if(obj.image) embed.setImage(obj.image);
    if(obj.thumbnail) embed.setThumbnail(obj.thumbnail);
    if(obj.timestamp) embed.setTimestamp();

    if(obj.author) {
        let name = obj.author.name || null;
        let url = obj.author.url || null;
        let iconURL = obj.author.iconURL || null;
        embed.setAuthor({ name: name, url: url, iconURL: iconURL });
    }

    if(obj.footer) {
        let text = obj.footer.text || null;
        let iconURL = obj.footer.iconURL || null; 
        embed.setFooter({ text: text, iconURL: iconURL });
    }

    if(obj.fields) {
        obj.fields.forEach((field) => {
            embed.addFields({ name: field.name, value: field.value, inline: field.inline || false });
        });
    }
    return embed;
}

export default {
    parseInteraction,
    buildEmbed,
    wait: setTimeout,
    getRoles,
    changeProperty,
    getMemberByTag,
    getIntfromString
}
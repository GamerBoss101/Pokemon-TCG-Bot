import { postToGuild } from "../../handlers/command_handler"

export default async(Discord, client, guild) => {
    postToGuild(guild);
}
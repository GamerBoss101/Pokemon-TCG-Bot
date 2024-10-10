import { post } from "../../handlers/command_handler.js";

export default async(Discord, client) => {
    client.user?.setPresence({ activities: [{ name: '/help' }] });
    try {
        post(client);
    } catch (err) {
        console.log(err);
    } finally {
        console.log(`Logged in as ${client.user.tag}!`);
    }
}
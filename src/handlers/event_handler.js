import fs from "fs";
import path from "path";
import ms from "ms";

let Events = [];

function isEvent(file) {
    return file.endsWith(".js");
}

function ScanDir(Discord, client, dir) {
    fs.readdirSync(dir).forEach((file) => {
        if(isEvent(file)) return loadEvent(Discord, client, `${dir}/${file}`);
        else return ScanDir(Discord, client, `${dir}/${file}`);
    });
}

async function loadEvent(Discord, client, file) {
    const event = await import(file);
    let event_name = file.split("/");
    event_name = event_name[event_name.length - 1].split(".")[0];
    client.on(event_name, event.default.bind(null, Discord, client));
    Events.push(event_name);
}

export default async(Discord, client) => { 
    ScanDir(Discord, client, path.join(__dirname, `../events`));
    await client.util.wait(ms("5s"));
    Events.forEach((event) => {
        client.logger.log(`${event} - Event Loaded`);
    });
}
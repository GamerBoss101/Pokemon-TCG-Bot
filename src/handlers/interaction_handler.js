import fs from "fs";
import path from "path";

import ms from "ms";

function isAction(file) {
    return file.endsWith(".js");
}

function ScanDir(Discord, client, dir) {
    fs.readdirSync(dir).forEach((file) => {
        if(isAction(file)) return loadAction(Discord, client, `${dir}/${file}`);
        else return ScanDir(Discord, client, `${dir}/${file}`);
    });
}

async function loadAction(Discord, client, file) {
    const action = new (await import(file)).default();
    client.action.set(action.getId(), action);
}

export default async(Discord, client) => { 
    ScanDir(Discord, client, path.join(__dirname, `../interactions/`));
    await client.util.wait(ms("5s"));
    client.logger.log(`${client.action.size} - Actions Loaded`);
}
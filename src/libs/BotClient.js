import Discord from 'discord.js';
import Formatter from './Formatter.js';
import Logger from './Logger.js';
import Util from './Util.js';

import { PokemonTCG } from '@bosstop/pokemontcgapi';

export default class BotClient extends Discord.Client {
    constructor(props) {
        super(props);
        this.storage = null;
        this.commands = new Discord.Collection();
        this.action = new Discord.Collection();
        this.formatter = new Formatter();
        this.logger = new Logger();
        this.util = Util;
    
        this.tcg = new PokemonTCG(process.env.POKEMON_TCG_API_KEY);
        this.commandInfo = new Discord.Collection();
    }

    async init(mongoServer) {
        this.storage = mongoServer;
    }
}


export default class Logger {
   
    colorize(inputString) {
        const minecraftColorCodes = {
            '0': '\x1b[30m', // Black
            '1': '\x1b[34m', // Dark Blue
            '2': '\x1b[32m', // Dark Green
            '3': '\x1b[36m', // Dark Aqua
            '4': '\x1b[31m', // Dark Red
            '5': '\x1b[35m', // Purple
            '6': '\x1b[33m', // Gold
            '7': '\x1b[37m', // Gray
            '8': '\x1b[90m', // Dark Gray
            '9': '\x1b[94m', // Blue
            'a': '\x1b[92m', // Green
            'b': '\x1b[96m', // Aqua
            'c': '\x1b[91m', // Red
            'd': '\x1b[95m', // Light Purple
            'e': '\x1b[93m', // Yellow
            'f': '\x1b[97m', // White
            'k': '\x1b[5m',  // Obfuscated
            'l': '\x1b[1m',  // Bold
            'm': '\x1b[9m',  // Strikethrough
            'n': '\x1b[4m',  // Underline
            'o': '\x1b[3m',  // Italic
            'r': '\x1b[0m'   // Reset
        };
    
        const parts = inputString.split('&');
        let outputString = parts[0];
    
        for (let i = 1; i < parts.length; i++) {
            const colorCode = parts[i][0];
            const restOfString = parts[i].slice(1);
    
            if (minecraftColorCodes.hasOwnProperty(colorCode)) {
                outputString += minecraftColorCodes[colorCode] + restOfString;
            } else {
                outputString += '&' + parts[i];
            }
        }
    
        return outputString;
    }

    decolorize(inputString) {
        const minecraftColorCodes = {
            '0': '',
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            '6': '',
            '7': '',
            '8': '',
            '9': '',
            'a': '',
            'b': '',
            'c': '',
            'd': '',
            'e': '',
            'f': '',
            'k': '',
            'l': '',
            'm': '',
            'n': '',
            'o': '',
            'r': '',
        };
    
        const parts = inputString.split('&');
        let outputString = parts[0];
    
        for (let i = 1; i < parts.length; i++) {
            const colorCode = parts[i][0];
            const restOfString = parts[i].slice(1);
    
            if (minecraftColorCodes.hasOwnProperty(colorCode)) {
                outputString += minecraftColorCodes[colorCode] + restOfString;
            } else {
                outputString += '&' + parts[i];
            }
        }
    
        return outputString;
    }

    log(input) {
        console.log(this.colorize(input + "&r"));
    }


}
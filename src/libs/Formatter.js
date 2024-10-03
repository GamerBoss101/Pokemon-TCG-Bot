import fs from "fs";
import yaml from "js-yaml";

export default class Formatter {
    constructor() {
        this.obj = null;
    }
    readYaml(path) {
        try {
            const fileContents = fs.readFileSync(path, 'utf8');
            return yaml.load(fileContents);
        } catch (e) {
            console.log(e);
        }
    }
    jsonPathToValue(jsonData, path) {
        if (!(jsonData instanceof Object) || typeof (path) === "undefined") {
            throw "InvalidArgumentException(jsonData:" + jsonData + ", path:" + path + ")";
        }
        path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        path = path.replace(/^\./, ''); // strip a leading dot
        var pathArray = path.split('.');
        for (var i = 0, n = pathArray.length; i < n; ++i) {
            var key = pathArray[i];
            if (key in jsonData) {
                if (jsonData[key] !== null) {
                    jsonData = jsonData[key];
                } else {
                    return null;
                }
            } else {
                return key;
            }
        }
        return jsonData;
    }
    trimBrackets(input) {
        let start = false, end = false;
        let final = input.split('');
        while(start == false) {
            if(final[0] != '{') {
                final.shift();
            } else {
                start = true;
            }
        }
        while(end == false) {
            if(final[final.length - 1] != '}') {
                final.pop();
            } else {
                end = true;
            }
        }
        return final.join('');
    }
    parseString(input) {
        let result = input;
        input.split(' ').forEach(async(word) => {
            if(!word.includes('{') && !word.includes('}')) return;
            let key = this.trimBrackets(word);
            if(!key.startsWith('{') && !key.endsWith('}')) return;
            key = key.replace('{', '').replace('}', '').split('_');
            if(key[0] == 'role') result = result.replace(`{${key[0]}_${key[1]}}`, "<@&" + key[1] + ">");
            if(key[0] == 'user') result = result.replace(`{${key[0]}_${key[1]}}`, "<@" + key[1] + ">");
            if(key[0] == 'channel') result = result.replace(`{${key[0]}_${key[1]}}`, "<#" + key[1] + ">");
            if(this.obj != null) {
                if(this.obj[key[0]] != null) result = result.replace(`{${key.join("_")}}`, this.jsonPathToValue(this.obj, key.join(".")));
            }
        });
        return result;
    }
    parseObject(input) {
        for (const [key, value] of Object.entries(input)) {
            if (typeof input[key] == "string") input[key] = this.parseString(value);
            if (typeof input[key] == "object") input[key] = this.parseObject(input[key]);
        }
        return input;
    }
    format(path, obj = {}) {
        let result = null;
        try {
            this.obj = obj;
            result = this.parseObject(this.readYaml(path))
        } finally {
            this.obj = null;
        }
        return result;
    }
}
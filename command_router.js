/**
 * This is a model that routes incoming command requests
 * 
 * Given the command text, it will route it to the appropiate function, and return a promise 
 */

const test = require("./commands/test");
const createprogram = require("./commands/createprogram");
const merge = require("./commands/merge");
const contrib = require("./commands/contrib");

const routes = {
    test,
    createprogram,
    merge,
    contrib
};

async function runCommand(text, kaid, cookies) {
    // TODO: parse commands better
    let args = text.split(" ");
    let command = args.splice(0, 1)[0];

    if(!(command in routes)) {
        return `The command ${command} does not exist.`;
    }

    return routes[command](args, kaid, cookies);
}

module.exports = {
    runCommand
};

/**
 * This is a model that routes incoming command requests
 * 
 * Given the command text, it will route it to the appropiate function, and return a promise 
 */

const test = require("./commands/test");
const createprogram = require("./commands/createprogram");
const deleteprogram = require("./commands/deleteprogram/deleteprogram");
const programsettings = require("./commands/programsettings.js");
const merge = require("./commands/merge/merge.js");
const contrib = require("./commands/contrib");

const CommandError = require("./error/command_error.js");

const routes = {
    test,
    createprogram,
    deleteprogram,
    programsettings,
    merge,
    contrib
};

async function runCommand(cookies, text, kaid) {
    return new Promise((resolve, reject) => {
        // TODO: parse commands better
        let args = text.split(" ");
        let command = args.splice(0, 1)[0].toLowerCase();

        if(!(command in routes)) {
            return `The command ${command} does not exist.`;
        }

        const commandResult = routes[command](cookies, args, kaid);

        return Promise.resolve(commandResult).catch(error => {
            if(error.name === "CommandError") {
                resolve(error.message);
            } else {
                console.error(error);
                resolve("An error occured. Try checking you command arguments?");
            }
        }).then(resolve);
    });
}

module.exports = {
    runCommand
};

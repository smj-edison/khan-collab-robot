const test = require("./commands/test");

const routes = {
    "test": test
};

async function runCommand(text, kaid) {
    // TODO: parse commands better
    let args = text.split(" ");
    let command = args.splice(0, 1)[0];

    if(!(command in routes)) {
        return `The command ${command} does not exist.`;
    }

    return routes[command](args, kaid);
}

module.exports = {
    runCommand
};

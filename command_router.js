let test = require("./commands/test");

var routes = {
    "test": test
};

function run_command(text) {
    // TODO: parse commands better
    var args = text.split(" ");

    var command = args.splice(0, 1);

    routes[command](args);
}

module.exports = {
    run_command
};

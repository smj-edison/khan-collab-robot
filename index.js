"use strict"

const {login} = require("./session");
const {updateProgram} = require("./programs");
const {pollCommands} = require("./poll_commands");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

function checkForNewCommands() {
    console.log("checking for new posts");

    // TODO: crappy job here
    pollCommands(process.env.COMMAND_COMMENT, cookies);
}

//capture results so that they aren't printed to the console
let _ = (async function() {
    console.log("logging in...");
    let cookies = await login(username, password);
    console.log("logged in");

    checkForNewCommands();

    setInterval(() => {
        checkForNewCommands();
    }, 1000 * 10);
})();

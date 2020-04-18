"use strict"

const {login} = require("./session");
const {updateProgram} = require("./programs");
const {pollCommands} = require("./poll_commands");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

//capture results so that they aren't printed to the console
let _ = (async function() {
    let cookies = await login(username, password);
    console.log("logged in");

    console.log("checking for new posts");

    // TODO: crappy job here
    pollCommands(process.env.COMMAND_COMMENT, cookies);

    setInterval(() => {
        console.log("checking for new posts");

        // TODO: crappy job here
        pollCommands(process.env.COMMAND_COMMENT, cookies);
    }, 1000 * 10);
})();

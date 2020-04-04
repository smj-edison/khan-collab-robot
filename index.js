"use strict"

const {login} = require("./session");
const {updateProgram} = require("./programs");
const {pollCommands} = require("./poll_commands");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

//capture results so that they aren't printed to the console
let _ = (async function() {
    let cookies = await login(username, password);
    let lastComment = "";

    setInterval(() => {
        console.log("checking for new posts");
        // TODO: crappy job here
        pollCommands(process.env.COMMAND_COMMENT, lastComment, cookies).then(last_comment => {
            lastComment = last_comment;
        });
    }, 1000 * 10);
})();

"use strict"

const {login} = require("./session");
const {updateProgram} = require("./programs");
const {pollCommands} = require("./poll_commands");
const {connect} = require("./db_connect");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

//capture results so that they aren't printed to the console
let _ = (async function() {
    let dbSession = await connect();
    console.log("connected to database");
    let cookies = await login(username, password);
    console.log("logged in");
    let lastComment = "";

    setInterval(() => {
        console.log("checking for new posts");

        // TODO: crappy job here
        pollCommands(process.env.COMMAND_COMMENT, dbSession, cookies);
    }, 1000 * 10);
})();

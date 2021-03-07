"use strict"

const {login} = require("ka-api").auth;
const {pollCommandsFromNotifications} = require("./src/polling/poll_commands.js");
const {checkForAndDeleteOldDiscussions} = require("./src/cleanup/discussion_culling.js");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

function checkForNewCommands(cookies) {
    console.log("checking for new posts");

    // TODO: crappy job here
    pollCommandsFromNotifications(cookies);
    checkForAndDeleteOldDiscussions(cookies);
}

//capture results so that they aren't printed to the console
let _ = (async function() {
    console.log("logging in...");
    let cookies = await login(username, password);
    console.log("logged in");

    checkForNewCommands(cookies);

    setInterval(() => {
        checkForNewCommands(cookies);
    }, 1000 * 10);
})();

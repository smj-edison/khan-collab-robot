"use strict"

const {login} = require("./session");
const {updateProgram} = require("./programs");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

//capture results so that they aren't printed to the console
let _ = (async function() {
    let cookies = await login(username, password);
    console.log("logged in!");

    updateProgram(cookies, process.env.TEST_PROGRAM, "pjs", "//test!").then(results => {
        console.log("Got results!", results);
    }).catch(err => {
        console.log("Error in changing program: ", err);
    });
})();

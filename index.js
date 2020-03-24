"use strict"

const axios = require("axios");
const cookieHelper = require("./cookies.js");
const {getSessionCookies, login} = require("./session.js");
const {updateProgram} = require("./programs");
const {commentAtRoot} = require("./comments");

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

//capture results so that they aren't printed to the console
let _ = (async function() {
    let sessionCookies = await getSessionCookies();
    console.log("got session cookies!");

    let loginCookies = await login(username, password, sessionCookies);

    let cookies = cookieHelper.mergeCookies(sessionCookies, loginCookies);

    //check that you are logged in
    console.assert((await axios.get("https://khanacademy.org", cookieHelper.genCookieHeader(cookies))).data.indexOf(username) >= 0,
        {errorMsg: "Not logged in correctly! When opening up khanacademy.org, it shows default page"});

    console.log("logged in!");

    updateProgram(cookies, process.env.TEST_PROGRAM, "pjs", "//updated from node!").then(results => {
        console.log("Got results!", results);
    }).catch(err => {
        console.log("Error in changing program: ", err);
    });
})();
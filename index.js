"use strict"

const axios = require("axios");
const cookieHelper = require("./cookies.js");
const {getSessionCookies, login} = require("./session.js");
const {updateProgram} = require("./programs");

async function commentAtRoot(commentURL, text, cookies) {
    var commentJSON = {
        "fromVideoAuthor": false,
        "shownLowQualityNotice": false,
        "text": text,
        "topic_slug": "computer-programming"
    }

    axios.post(commentURL + `?casing=camel&lang=en&_=190828-1155-f259d8dcd107_${Date.now()}`, commentJSON, {
        headers: {
            Cookie: cookieHelper.cookiesToCookieString(cookies),
            "X-KA-FKey": cookieHelper.getCookieValue(cookies, "fkey")
        }
    });
};

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
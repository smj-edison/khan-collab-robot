"use strict"

let request = require("request");

let jar = request.jar();

const PROGRAM_DEFAULT_JSON = require("./constants").PROGRAM_SAVE_JSON_DEFAULT;

function statusCodePromise(resolve, reject) {
    return (error, response, body) => {
        console.error(error);
        console.log(response);

        let statusCodeFirstNumber = Math.floor(response.statusCode / 100);

        if (statusCodeFirstNumber == 2) {
            resolve(body);
        } else {
            reject(error);
        }
    }
}

function getRequest(uri, settings={}) {
    return new Promise((resolve, reject) => {
        request(uri, settings, statusCodePromise(resolve, reject))
    });
}

function getSessionCookies(cookies) {
    return getRequest("https://khanacademy.org", {
        jar: cookies
    });
}

async function login(cookies, username, password) {
    return new Promise((resolve, reject) => {
        request.post("https://www.khanacademy.org/login", {
            jar: cookies
        }, statusCodePromise(resolve, reject)).form({
            "identifier": username,
            "password": password,
            "fkey": cookies._jar.store.idx["www.khanacademy.org"]["/"].fkey.value,
            "continue": "/"
        });
    });
}

//returns a promise for a GET request to the URI passed in


function getProgramJSON(id) {
    return getRequest("https://www.khanacademy.org/api/internal/scratchpads/" + id);
}

// 190812-1645-93fee248ac6f_1565658007119
// 190812-1645-93fee248ac6f_1565658171688
// 190812-1645-93fee248ac6f_1565658565643

// ??????-????-????????????_(new Date()).getTime()

function getQueryTime() {
    var timeModifier = (new Date()).toTimeString();
    timeModifier = timeModifier.substring(timeModifier.indexOf("GMT") + 3, timeModifier.indexOf("GMT") + 8);
    timeModifier = timeModifier.substring(0, 3) + ":" + timeModifier.substring(3);
    return (new Date((new Date()) - (new Date(parseInt(timeModifier) * 60 * 60 * 1000)))).toISOString().substring(0, 19) + timeModifier;
}

async function updateProgram(cookies, programId, programType, code, settings={}) {
    var programJson = JSON.parse(await getProgramJSON(programId)); //get the program's JSON, is this necessary?

    var jsonToSend = {
        ...PROGRAM_DEFAULT_JSON,
        ...programJson,
        "relativeUrl": "/computer-programming/_/" + programId,
        "id": parseInt(programId),
        /*"kaid": kaid, //provided when loading programJson */
        "date": (new Date()).toISOString().substring(0, 19) + "Z",
        "revision": {
            ...PROGRAM_DEFAULT_JSON.revision,
            ...programJson.revision,
            "created": (new Date()).toISOString().substring(0, 19) + "Z",
            "code": code
        },
        "trustedRevision": {
            "created": (new Date()).toISOString()
        },
        ...settings
    };

    return new Promise((resolve, reject) => {
        request(`https://www.khanacademy.org/api/internal/scratchpads/${programId}?client_dt=${getQueryTime()}&lang=en`, {
            method: "PUT",
            json: jsonToSend,
            jar: cookies
        }, statusCodePromise(resolve, reject));
    });
}

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

(async function() {
    await getSessionCookies(jar);
    await login(jar, username, password);
    await updateProgram(jar, "0000000000000000", "pjs", "//updated from node!");
})();
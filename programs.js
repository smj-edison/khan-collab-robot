const axios = require("axios");
const {makePutRequest, makePostRequest} = require("./session");
const {parseProgramHeaders, generateProgramHeaders, stripProgramHeaders} = require("./program_header");
const PROGRAM_DEFAULT_JSON = require("./constants").PROGRAM_SAVE_JSON_DEFAULT;

/**
 * A helper function that returns the current time formatted for KA's servers
 */
function getQueryTime() {
    var now = new Date();

    var timeZone = now.toTimeString();
    timeZone = timeZone.substring(timeZone.indexOf("GMT") + 3, timeZone.indexOf("GMT") + 8);
    timeZone = timeZone.substring(0, 3) + ":" + timeZone.substring(3);

    //TODO: this needs to be cleaned up, and also stablized
    return (new Date(now.getTime() - now.getTimezoneOffset() * 60000)).toISOString().substring(0, 19) + timeZone;
}

/**
 * Returns the parsed program JSON for a program, given the program's ID
 * @param {*} id The program's ID
 */
async function getProgramJSON(id) {
    return axios.get("https://www.khanacademy.org/api/internal/scratchpads/" + id)
                .then(response => {
                    return response.data;
                });
}

/**
 * Updates an existing program based on the parameters
 * @param {Array} cookies An array of set-cookie response headers from axios
 * @param {*} programId The program's ID being updated
 * @param {*} code A string of with the code
 * @param {*} settings Settings to override the JSON request
 */
async function updateProgram(cookies, programId, code, settings={}) {
    var programJson = await getProgramJSON(programId); //get the program's JSON, is this necessary?

    var jsonToSend = {
        ...PROGRAM_DEFAULT_JSON,
        ...programJson,
        "relativeUrl": "/computer-programming/_/" + programId,
        "id": parseInt(programId),
        "date": (new Date()).toISOString().substring(0, 19) + "Z",
        "revision": {
            ...PROGRAM_DEFAULT_JSON.revision,
            ...programJson.revision,
            "code": code
        },
        "trustedRevision": {
            "created": (new Date()).toISOString()
        },
        ...settings
    };

    let url = `https://www.khanacademy.org/api/internal/scratchpads/${programId}?client_dt=${getQueryTime()}&lang=en`;
    
    return makePutRequest(url, jsonToSend, cookies);
}

async function newProgram(cookies, code, settings={}) {
    let jsonToSend = {
        title: "New program",
        translatedTitle: "New program",
        category: null,
        difficulty: null,
        tags: [],
        userAuthoredContentType: "pjs",
        topicId: "xffde7c31",
        revision: {
            code: code || "",
            editor_type: "ace_pjs",
            folds: [],
            image_url: PROGRAM_DEFAULT_JSON.revision.image_url,
            config_version: 4,
            topic_slug: "computer-programming"
        },
        ...settings
    };

    let url = `https://www.khanacademy.org/api/internal/scratchpads?client_dt=${getQueryTime()}&lang=en`;

    return makePostRequest(url, jsonToSend, cookies);
}

async function getProgramCodeAndHeaders(id) {
    const program = await getProgramJSON(id);

    const codeRaw = program.revision.code;

    const codeHeaders = parseProgramHeaders(codeRaw);
    const code = stripProgramHeaders(codeRaw);

    return [codeHeaders, code];
}

async function updateProgramCodeAndHeaders(cookies, programId, codeHeaders, code, settings={}) {
    const codeWithHeaders = generateProgramHeaders(codeHeaders) + "\n" + code;

    return updateProgram(cookies, programId, codeWithHeaders, settings);
}

module.exports = {
    getProgramJSON,
    updateProgram,
    newProgram,
    getProgramCodeAndHeaders,
    updateProgramCodeAndHeaders
};

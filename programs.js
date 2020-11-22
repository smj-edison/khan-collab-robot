const axios = require("axios");
const {makePutRequest, makePostRequest, makeDeleteRequest} = require("./session");
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
async function updateProgram(cookies, programId, code, settings={}, programJson) {
    programJson = programJson || await getProgramJSON(programId); //get the program's JSON, is this necessary?

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

async function newProgram(cookies, code, settings={}, type) {
    let jsonToSend = {
        title: "New program",
        translatedTitle: "New program",
        category: null,
        difficulty: null,
        tags: [],
        userAuthoredContentType: type,
        topicId: "xffde7c31",
        revision: {
            code: code || "",
            editor_type: "ace_" + type,
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

async function spinOffProgram(cookies, originalProgram, code, settings={}, originalProgramJson) {
    originalProgramJSON = originalProgramJson || await getProgramJSON(originalProgram);

    let jsonToSend = {
        title: "New program",
        originRevisionId: originalProgramJSON.revision.id,
        originScratchpadId: originalProgram,
        originScratchpadKind: "Scratchpad",
        revision: {
            code: code || "",
            editor_type: "ace_pjs",
            editorType: "ace_pjs",
            folds: [],
            image_url: PROGRAM_DEFAULT_JSON.revision.image_url,
            mp3Url: "",
            translatedMp3Url: null,
            youtubeId: null,
            playback: "",
            tests: "",
            config_version: 4,
            configVersion: 4,
            topic_slug: "computer-programming"
        },
        ...settings
    };

    let url = `https://www.khanacademy.org/api/internal/scratchpads?client_dt=${getQueryTime()}&lang=en`;

    return makePostRequest(url, jsonToSend, cookies);
}

async function deleteProgram(cookies, programId) {
    let url = `https://www.khanacademy.org/api/internal/scratchpads/${programId}?client_dt=${getQueryTime()}&lang=en`;
    
    return makeDeleteRequest(url, cookies);
}

async function getProgramCodeAndHeaders(id) {
    const program = await getProgramJSON(id);

    const codeRaw = program.revision.code;

    const codeHeaders = parseProgramHeaders(codeRaw, program.userAuthoredContentType);
    const code = stripProgramHeaders(codeRaw, program.userAuthoredContentType);

    return [codeHeaders, code];
}

async function updateProgramCodeAndHeaders(cookies, programId, codeHeaders, code, settings={}) {
    const programJson = await getProgramJSON(programId);

    const codeWithHeaders = code + "\n" + generateProgramHeaders(codeHeaders, programJson.userAuthoredContentType);

    return updateProgram(cookies, programId, codeWithHeaders, settings, programJson);
}

async function spinOffProgramCodeAndHeaders(cookies, originalProgramId, codeHeaders, code, settings={}) {
    const originalProgramJson = await getProgramJSON(originalProgramId);

    const codeWithHeaders = code + "\n" + generateProgramHeaders(codeHeaders, originalProgramJson.userAuthoredContentType);

    return spinOffProgram(cookies, originalProgramId, codeWithHeaders, settings, originalProgramJson);
}

async function changeProgramHeaders(cookies, programId, lambdaThatWillChangeHeaders) {
    let [headers, code] = await getProgramCodeAndHeaders(programId);

    lambdaThatWillChangeHeaders(headers);

    await updateProgramCodeAndHeaders(cookies, programId, headers, code);
}

module.exports = {
    getProgramJSON,
    updateProgram,
    spinOffProgram,
    newProgram,
    deleteProgram,
    getProgramCodeAndHeaders,
    updateProgramCodeAndHeaders,
    changeProgramHeaders,
    spinOffProgramCodeAndHeaders
};

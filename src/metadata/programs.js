const axios = require("axios");
const {makePutRequest, makePostRequest, makeDeleteRequest} = require("./session");
const {parseProgramHeaders, generateProgramHeaders, stripProgramHeaders} = require("./program_header");
const PROGRAM_DEFAULT_JSON = require("../constants").PROGRAM_SAVE_JSON_DEFAULT;
const {CommandError} = require("../error/command_error");


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

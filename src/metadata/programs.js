const {getProgramJSON} = require("ka-api").programs;

const {parseProgramHeaders, generateProgramHeaders, stripProgramHeaders} = require("./program_header.js");

async function getProgramCodeAndHeaders(id) {
    const program = await getProgramJSON(id);

    const codeRaw = program.revision.code;

    const codeHeaders = parseProgramHeaders(codeRaw, program.userAuthoredContentType);
    const code = stripProgramHeaders(codeRaw, program.userAuthoredContentType);

    return {
        codeHeaders,
        code
    };
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
    let {codeHeaders, code} = await getProgramCodeAndHeaders(programId);

    lambdaThatWillChangeHeaders(codeHeaders);

    await updateProgramCodeAndHeaders(cookies, programId, codeHeaders, code);
}

module.exports = {
    getProgramJSON,
    getProgramCodeAndHeaders,
    updateProgramCodeAndHeaders,
    changeProgramHeaders,
    spinOffProgramCodeAndHeaders
};

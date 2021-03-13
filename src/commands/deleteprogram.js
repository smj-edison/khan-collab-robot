const {deleteProgram} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../metadata/programs");
const {isAuthor} = require("../authorization/authorization.js");

async function deleteprogram(cookies, args, kaid) {
    const programId = args[0];

    let {codeHeaders} = await getProgramCodeAndHeaders(programId);

    // make sure they have permission
    if(!isAuthor(codeHeaders, kaid)) {
        return "You are not authorized to do this.";
    }

    await Promise.all([
        deleteProgram(cookies, programId),
        deleteProgram(cookies, codeHeaders.historyprogramid)
    ]);

    return "Successfully deleted program.";
}

module.exports = deleteprogram;
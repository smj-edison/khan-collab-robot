const {getSpinoffs, deleteProgram} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../../metadata/programs");
const {isAuthor} = require("../../authorization/authorization.js");
const cascadeDeleteProgram = require("./cascadeDeleteProgram.js");

async function deleteprogram(cookies, args, kaid) {
    const programId = args[0];

    let {codeHeaders} = await getProgramCodeAndHeaders(programId);

    // make sure they have permission
    if(!isAuthor(codeHeaders, kaid)) {
        return "You are not authorized to do this.";
    }

    await cascadeDeleteProgram(cookies, programId, codeHeaders);

    return "Successfully deleted program.";
}

module.exports = deleteprogram;

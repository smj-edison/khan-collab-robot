const {getSpinoffs, deleteProgram} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../metadata/programs");
const {isAuthor} = require("../authorization/authorization.js");

async function deleteprogram(cookies, args, kaid) {
    const programId = args[0];

    let {codeHeaders} = await getProgramCodeAndHeaders(programId);

    // make sure they have permission
    if(!isAuthor(codeHeaders, kaid)) {
        return "You are not authorized to do this.";
    }

    // get all the history program's spinoffs (by bors)
    const codeRevisionProgramsToDelete = (await getSpinoffs(codeHeaders.historyprogramid)).scratchpads.filter(spinoff => {
        return spinoff.authorKaid === process.env.BOT_KAID;
    }).map(spinoff => spinoff.url.match(/\d+(?=\?)?/)[0]);

    const revisionsDeletePromises = codeRevisionProgramsToDelete.map(codeRevisionProgram => deleteProgram(cookies, codeRevisionProgram));

    await Promise.all([
        deleteProgram(cookies, programId),
        deleteProgram(cookies, codeHeaders.historyprogramid)
    ].concat(revisionsDeletePromises));

    return "Successfully deleted program.";
}

module.exports = deleteprogram;
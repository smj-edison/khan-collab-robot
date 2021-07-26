const {getProgramCodeAndHeaders} = require("../../metadata/programs");

async function cascadeDeleteProgram(cookies, programId, codeHeaders) {
    codeHeaders = codeHeaders || (await getProgramCodeAndHeaders(programId));

    // get all the history program's spinoffs (by bors)
    const codeRevisionProgramsToDelete = (await getSpinoffs(codeHeaders.historyprogramid)).scratchpads.filter(spinoff => {
        return spinoff.authorKaid === process.env.BOT_KAID;
    }).map(spinoff => spinoff.url.match(/\d+(?=\?)?/)[0]);

    const revisionsDeletePromises = codeRevisionProgramsToDelete.map(codeRevisionProgram => deleteProgram(cookies, codeRevisionProgram));

    await Promise.all([
        deleteProgram(cookies, programId),
        deleteProgram(cookies, codeHeaders.historyprogramid)
    ].concat(revisionsDeletePromises));
}

module.exports = cascadeDeleteProgram;

const {getProgramCodeAndHeaders, deleteProgram} = require("../programs");

async function deleteprogram(args, kaid, cookies) {
    const programId = args[0];

    let [headers, code] = await getProgramCodeAndHeaders(programId);

    // make sure they have permission
    if(!isAuthor(headers, kaid)) {
        return "You are not authorized to do this.";
    }

    await deleteProgram(cookies, programId);
    await deleteProgram(cookies, headers.historyprogramid);

    return "Successfully deleted program.";
}

module.exports = deleteprogram;
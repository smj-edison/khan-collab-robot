const {getProgramJSON, updateProgram} = require("../programs");
const {parseProgramHeaders, generateProgramHeaders, stripProgramHeaders} = require("../program_header");

async function merge(args, kaid, cookies) {
    const programNew = args[0]; // the new code
    const programOld = args[1]; // the program being merged into

    // get the code from both of them
    const programNewJSON = await getProgramJSON(programNew);
    const programOldJSON = await getProgramJSON(programOld);

    const programNewCodeRaw = programNewJSON.revision.code;
    const programOldCodeRaw = programOldJSON.revision.code;

    // get the program headers
    const programNewHeaders = parseProgramHeaders(programNewCodeRaw);
    const programOldHeaders = parseProgramHeaders(programOldCodeRaw);

    const programNewCode = stripProgramHeaders(programNewCodeRaw);
    const programOldCode = stripProgramHeaders(programOldCodeRaw);

    // make sure they own it
    if(kaid !== programOldHeaders.author) {
        return "You are not the author. You cannot merge.";
    }

    // this is where merging should be calculated (I'm cheating)
    // TODO: account for the headers at the top of the program
    const newCode = programNewCode;
    const newHeaders = programOldHeaders;

    // update the program
    const newCodeWithHeaders = generateProgramHeaders(newHeaders) + "\n" + newCode;
    await updateProgram(cookies, programOld, newCodeWithHeaders);

    return "Your program was successfully merged.";
}

module.exports = merge;

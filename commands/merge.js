const {updateProgramCodeAndHeaders, getProgramCodeAndHeaders} = require("../programs");
const {isAuthor, isContributor} = require("../authorization");

async function merge(args, kaid, cookies) {
    const programNew = args[0]; // the new code
    const programOld = args[1]; // the program being merged into

    let [programNewHeaders, programNewCode] = await getProgramCodeAndHeaders(programNew);
    let [programOldHeaders, programOldCode] = await getProgramCodeAndHeaders(programOld);

    // make sure they have permission
    if(!(isAuthor(programOldHeaders, kaid) || isContributor(programOldHeaders, kaid))) {
        return "You are not authorized to do this.";
    }

    // this is where merging should be calculated (I'm cheating)
    // TODO: account for the headers at the top of the program
    const newCode = programNewCode;
    const newHeaders = programOldHeaders;

    // update the program
    await updateProgramCodeAndHeaders(cookies, programOld, newHeaders, newCode);

    return "Your program was successfully merged.";
}

module.exports = merge;

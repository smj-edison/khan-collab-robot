const {updateProgramCodeAndHeaders, getProgramCodeAndHeaders} = require("../programs");
const {isAuthor, isContributor} = require("../authorization");
const {loadProgramHistory, updateProgramHistory} = require("../program_history");


async function merge(args, kaid, cookies) {
    const programBranch = args[0]; // the new code
    const programMaster = args[1]; // the program being merged into

    let [branchHeaders, branchCode] = await getProgramCodeAndHeaders(programBranch);
    let [masterHeaders, masterCode] = await getProgramCodeAndHeaders(programMaster);

    const programHistory = loadProgramHistory(masterHeaders.historyprogramid);

    // make sure they have permission
    if(!(isAuthor(masterHeaders, kaid) || isContributor(masterHeaders, kaid))) {
        return "You are not authorized to do this.";
    }

    // this is where merging should be calculated (I'm cheating)
    // TODO: account for the headers at the top of the program
    const newCode = branchCode;
    const newHeaders = masterHeaders;

    // record the merge in the program history
    if(!programHistory.merges) programHistory.merges = [];

    programHistory.merges.push({
        timestamp: Date.now(),
        code: newCode,
        mergeId: programBranch
    });

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMaster, newHeaders, newCode),
        updateProgramHistory(cookies, programMaster, programHistory)
    ]);
    

    return "Your program was successfully merged.";
}

module.exports = merge;

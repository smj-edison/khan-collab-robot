const {updateProgramCodeAndHeaders} = require("../../metadata/programs.js");
const {updateProgramHistory} = require("../../metadata/program_history.js");

const getNewMergeRecord = require("./getNewMergeRecord.js");

async function successfulMerge(cookies, historyProgramId, programHistory, programBranchId, programMasterId, masterHeaders, newCode, newHeaders) {
    // record the merge in the program history
    const newMergeRecord = await getNewMergeRecord(cookies, newCode, historyProgramId, programBranchId);

    programHistory.merges.push(newMergeRecord);
    newHeaders.currentrevisionid = newMergeRecord.revisionId;

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMasterId, newHeaders, newCode),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);

    return "Your program was successfully merged.";
}

module.exports = successfulMerge;

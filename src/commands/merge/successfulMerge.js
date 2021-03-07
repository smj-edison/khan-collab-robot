const {updateProgramCodeAndHeaders} = require("../../metadata/programs.js");
const {updateProgramHistory} = require("../../metadata/program_history.js");

const getNewMergeRecord = require("./getNewMergeRecord.js");

async function successfulMerge(cookies, programHistory, programBranchId, programMasterId, masterHeaders, newCode, newHeaders) {
    // record the merge in the program history
    const newMergeRecord = getNewMergeRecord(newCode, programBranchId);

    programHistory.push(newMergeRecord);
    newHeaders.currentmergeid = newMergeRecord.mergeId;

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMasterId, newHeaders, newCode),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);

    return "Your program was successfully merged.";
}

module.exports = successfulMerge;

const {getProgramJSON, deleteProgram} = require("ka-api").programs;

const {CommandError} = require("../../error/command_error.js");
const {updateProgramCodeAndHeaders, getProgramCodeAndHeaders} = require("../../metadata/programs.js");
const {updateProgramHistory} = require("../../metadata/program_history.js");

const getNewMergeRecord = require("./getNewMergeRecord.js");

function checkForMergeConflicts(code) {
    return code.split("\n").find(line => {
        return line === "<<<<<<<<<" ||
               line === "=========" ||
               line === ">>>>>>>>>";
    });
}

async function deleteBranch(cookies, branchId) {
    const branchJSON = await getProgramJSON(branchId);

    // the program that showed all the conflicts (aka the parent spinoff)
    const conflictProgram = branchJSON.originScratchpadId;

    const {codeHeaders: conflictProgramHeaders} = await getProgramCodeAndHeaders(conflictProgram);

    // make sure that the program is actually conflicted, and not just trying to delete someone else's program
    if(conflictProgramHeaders.conflict === "true") {
        await deleteProgram(cookies, conflictProgram);
    } else {
        throw new CommandError("Cannot delete that program's parent as it is not conflicted (please let the bot maintainer know, this should never happen).");
    }
}

async function resolveConflictMerge(cookies, historyProgramId, programHistory, programBranchId, programMasterId, masterHeaders, branchCode) {
    // make sure there isn't any conflicted code in it
    if(checkForMergeConflicts(branchCode)) {
        return "You have not removed all conflicts. Remove all conflicts and try again.";
    }

    // record the merge in the program history
    const newMergeRecord = await getNewMergeRecord(cookies, branchCode, historyProgramId, programBranchId);

    programHistory.merges.push(newMergeRecord);
    masterHeaders.currentrevisionid = newMergeRecord.revisionId;

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMasterId, masterHeaders, branchCode),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);

    await deleteBranch(cookies, programBranchId);

    return `Conflict successfully resolved. Be sure to delete https://khanacademy.org/computer-programming/_/${programBranchId}`;
}

module.exports = resolveConflictMerge;

const {getProgramJSON} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../../metadata/programs.js");
const {isAuthor, isContributor} = require("../../authorization/authorization");
const {loadProgramHistory} = require("../../metadata/program_history.js");

const calculateMerge = require("./calculateMerge.js");
const successfulMerge = require("./successfulMerge.js");
const conflictedMerge = require("./conflictedMerge.js");
const resolveConflictMerge = require("./resolveConflictMerge.js");

function parseArgs(args) {
    return {
        programBranchId: args[0],
        programMasterId: args[1]
    }
}

function isKaidAuthorized(masterHeaders, kaid) {
    return isAuthor(masterHeaders, kaid) || isContributor(masterHeaders, kaid);
}

/**
 * Search the program history for the right revision and return the code for that revision
 * 
 * @param {*} programHistory 
 * @param {*} mergeId 
 */
async function getRevisionCode(programHistory, mergeId) {
    const mergeRecord = programHistory.merges.find(mergeHistory => {
        return mergeHistory.mergeId === mergeId;
    });

    if(mergeRecord) {
        if(mergeRecord.code) {
            return mergeRecord.code;
        } else if(mergeRecord.codePointer) {
            // if the merge record points to another program, load that one instead
            return (await getProgramJSON(mergeRecord.codePointer)).revision.code;
        }
    }
}

async function merge(args, kaid, cookies) {
    const {programBranchId, programMasterId} = parseArgs(args);

    // get headers and code for branch and master programs
    let {codeHeaders: branchHeaders, code: branchCode} = await getProgramCodeAndHeaders(programBranchId);
    let {codeHeaders: masterHeaders, code: masterCode} = await getProgramCodeAndHeaders(programMasterId);

    // load the master's program history
    let programHistory = await loadProgramHistory(masterHeaders.historyprogramid);
    if(!programHistory.merges) programHistory.merges = [];

    // make sure they have permission
    if(!isKaidAuthorized(masterHeaders, kaid)) {
        return "You are not authorized to do this.";
    }

    // if it's resolving a conflict
    if(branchHeaders.conflict === "true") {
        return await resolveConflictMerge(cookies, programHistory, programBranchId, programMasterId, masterHeaders, branchCode);
    }

    // calculate the merge
    const originalCode = getRevisionCode(programHistory, branchHeaders.currentmergeid);

    const mergeResult = calculateMerge(originalCode, masterCode, branchCode);

    const newCode = mergeResult.result;
    const newHeaders = masterHeaders;

    if(mergeResult.conflict) {
        return await conflictedMerge(cookies, programBranchId, newCode, newHeaders);
    } else {
        return await successfulMerge(cookies, programHistory, programBranchId, programMasterId, masterHeaders, newCode, newHeaders);
    }
}

module.exports = merge;

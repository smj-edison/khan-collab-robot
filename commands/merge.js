const {updateProgramCodeAndHeaders, getProgramCodeAndHeaders, spinOffProgramCodeAndHeaders, deleteProgram, getProgramJSON} = require("../programs");
const {isAuthor, isContributor} = require("../authorization");
const {loadProgramHistory, updateProgramHistory} = require("../program_history");
const uuidv1 = require("uuid").v1;
const Diff3 = require("node-diff3");

function addMergeRecord(programHistory, newCode, programBranchId) {
    const mergeId = uuidv1();

    programHistory.merges.push({
        timestamp: Date.now(),
        code: newCode,
        programId: programBranchId,
        mergeId: mergeId
    });

    return mergeId;
}

function calculateMerge(o, a, b) {
    o = o.split("\n");
    a = a.split("\n");
    b = b.split("\n");

    const results = Diff3.merge(a, o, b);

    if(!results.conflict) {
        return {
            conflict: false,
            result: results.result.join("\n")
        };
    }

    // get rid of spacing generated arount merge conflict string
    results.result = results.result.map(val => {
        if(val === "\n<<<<<<<<<\n") return "<<<<<<<<<";
        if(val === "\n=========\n") return "=========";
        if(val === "\n>>>>>>>>>\n") return ">>>>>>>>>";

        return val;
    });

    return {
        conflict: true,
        result: results.result.join("\n")
    };
}

async function successfulMerge(cookies, programHistory, programBranchId, programMasterId, masterHeaders, newCode, newHeaders) {
    // record the merge in the program history
    newHeaders.currentmergeid = addMergeRecord(programHistory, newCode, programBranchId);

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMasterId, newHeaders, newCode),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);

    return "Your program was successfully merged.";
}

async function conflictedMerge(cookies, programBranchId, newCode, newHeaders) {
    newHeaders.conflict = "true";
    newHeaders.conflictedbranch = programBranchId;

    const result = await spinOffProgramCodeAndHeaders(cookies, programBranchId, newHeaders, newCode);

    return `Your program has a conflict. Please resolve and spin-off at https://www.khanacademy.org${result.data.relativeUrl}`;
}

async function resolveConflict(cookies, programHistory, programBranchId, programMasterId, masterHeaders, branchCode, branchHeaders) {
    // make sure there isn't any conflicted code in it
    let conflictedCode = branchCode.split("\n").find(line => {
        return line === "<<<<<<<<<" ||
               line === "=========" ||
               line === ">>>>>>>>>";
    });

    if(conflictedCode) {
        return "You have not removed all conflicts. Remove all conflicts and try again.";
    }

    // record the merge in the program history
    branchHeaders.currentmergeid = addMergeRecord(programHistory, branchCode, programBranchId);

    const conflictedBranch = branchHeaders.conflictedbranch;

    delete branchHeaders.conflict;
    delete branchHeaders.conflictedbranch;

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMasterId, branchHeaders, branchCode),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);

    /// delete the program the showed all the conflicts ///

    const branchJSON = await getProgramJSON(programBranchId);
    // the program that showed all the conflicts
    const conflictProgram = branchJSON.originScratchpadId;

    const [conflictProgramHeaders, _] = await getProgramCodeAndHeaders(conflictProgram);

    // make sure that the program is actually conflicted, and not just trying to delete someone else's program
    if(conflictProgramHeaders.conflict === "true") {
        await deleteProgram(cookies, conflictProgram);
    }

    return `Conflict successfully resolved. Be sure to delete https://khanacademy.org/computer-programming/_/${programBranchId}`;
}

async function merge(args, kaid, cookies) {
    const programBranch = args[0]; // the new code
    const programMaster = args[1]; // the program being merged into

    let [branchHeaders, branchCode] = await getProgramCodeAndHeaders(programBranch);
    let [masterHeaders, masterCode] = await getProgramCodeAndHeaders(programMaster);

    let programHistory = await loadProgramHistory(masterHeaders.historyprogramid);
    if(!programHistory.merges) programHistory.merges = [];

    // make sure they have permission
    if(!isAuthor(masterHeaders, kaid) && !isContributor(masterHeaders, kaid)) {
        return "You are not authorized to do this.";
    }

    // if it's resolving a conflict
    if(branchHeaders.conflict === "true") {
        return await resolveConflict(cookies, programHistory, programBranch, programMaster, masterHeaders, branchCode, branchHeaders);        
    }

    // find the code for this revision
    let baseRecord = programHistory.merges.find(mergeHistory => {
        return mergeHistory.mergeId === branchHeaders.currentmergeid;
    });

    let originalCode = baseRecord ? baseRecord.code : masterCode;

    // this is where merging should be calculated (I'm cheating)
    // TODO: account for the headers at the top of the program
    const mergeResult = calculateMerge(originalCode, masterCode, branchCode);

    const newCode = mergeResult.result;
    const newHeaders = masterHeaders;

    if(mergeResult.conflict) {
        return await conflictedMerge(cookies, programBranch, newCode, newHeaders);
    } else {
        return await successfulMerge(cookies, programHistory, programBranch, programMaster, masterHeaders, newCode, newHeaders);
    }
}

module.exports = merge;

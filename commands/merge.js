const {updateProgramCodeAndHeaders, getProgramCodeAndHeaders} = require("../programs");
const {isAuthor, isContributor} = require("../authorization");
const {loadProgramHistory, updateProgramHistory} = require("../program_history");
const uuidv1 = require("uuid").v1;
const Diff3 = require("node-diff3");

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

    // this is where merging should be calculated (I'm cheating)
    // TODO: account for the headers at the top of the program
    const newCode = branchCode;
    const newHeaders = masterHeaders;

    // record the merge in the program history
    const mergeId = uuidv1();
    newHeaders.currentmergeid = mergeId;

    programHistory.merges.push({
        timestamp: Date.now(),
        code: newCode,
        programId: programBranch,
        mergeId: mergeId
    });

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMaster, newHeaders, newCode),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);
    

    return "Your program was successfully merged.";
}

module.exports = merge;

const uuidv4 = require("uuid").v4;

/*
const {spinOffProgramCodeAndHeaders} = require("../../metadata/programs.js");

async function getNewMergeRecord(cookies, newCode, historyProgramId, programBranchId) {
    // TODO: RENAME mergeId to revisionId everywhere
    const revisionId = uuidv4();

    const newProgramJSON = await spinOffProgramCodeAndHeaders(cookies, historyProgramId, {
        revisionId,
        historyProgramId
    }, newCode);

    const newProgramId = newProgramJSON.data.id;

    return {
        timestamp: Date.now(),
        codePointer: newProgramId, 
        programId: programBranchId,
        revisionId: revisionId
    };
}
*/

function getNewMergeRecord(newCode, programBranchId) {
    const revisionId = uuidv4();

    return {
        timestamp: Date.now(),
        code: newCode, 
        programId: programBranchId,
        revisionId: revisionId
    };
}

module.exports = getNewMergeRecord;

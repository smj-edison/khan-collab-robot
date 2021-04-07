const {updateProgramCodeAndHeaders} = require("../../metadata/programs.js");
const {updateProgramHistory} = require("../../metadata/program_history.js");
const {cleanupOldRevisions} = require("../../cleanup/revision_cleanup.js");

const getNewMergeRecord = require("./getNewMergeRecord.js");
const getPngBase64FromUrl = require("./getPngBase64FromUrl.js");

async function successfulMerge(cookies, historyProgramId, programHistory, programBranchId, programMasterId, masterHeaders, newCode, newHeaders) {
    // record the merge in the program history
    const newMergeRecord = await getNewMergeRecord(cookies, newCode, historyProgramId, programBranchId);

    programHistory.merges.push(newMergeRecord);
    newHeaders.currentrevisionid = newMergeRecord.revisionId;

    const branchJSON = await getProgramJSON(programBranchId);
    const branchThumbnail = await getPngBase64FromUrl(branchJSON.imageUrl); // use the image from the spinoff

    // update the program and history
    await Promise.all([
        updateProgramCodeAndHeaders(cookies, programMasterId, newHeaders, newCode, {
            revision: {
                image_url: branchThumbnail
            }
        }),
        updateProgramHistory(cookies, masterHeaders.historyprogramid, programHistory)
    ]);

    // clean up any unneeded code
    await cleanupOldRevisions(cookies, programMasterId, newHeaders, programHistory);

    return "Your program was successfully merged.";
}

module.exports = successfulMerge;

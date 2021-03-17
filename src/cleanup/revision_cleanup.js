const {getSpinoffs, deleteProgram} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../metadata/programs.js");
const {loadProgramHistory, updateProgramHistory} = require("../metadata/program_history.js");

async function getStaleRevisions(programId, codeHeaders, historyProgramResult) {
    // first, list all the spinoffs of the main program (the branches)
    const programSpinoffs = (await getSpinoffs(programId)).scratchpads;

    // use the kaids to figure out which programs are owned by contributors
    const spinoffKaids = programSpinoffs.map(spinoff => {return {
        kaid: spinoff.authorKaid,
        programId: spinoff.url.match(/\d+(?=\?)?/)[0] // get program id
    }});

    let contributors = codeHeaders.contributors ? codeHeaders.contributors.split(",") : [];
    contributors.push(codeHeaders.author); // add the author as a contributor

    // union spinoff kaids and contributors
    // these are all the programs that were created by contributors
    const programsToKeep = spinoffKaids.filter(value => contributors.includes(value.kaid));

    // load all the programs to keep
    const programs = await Promise.all(programsToKeep.map(program => getProgramCodeAndHeaders(program.codePointer)));
    const programsHeaders = programs.map(program => program.codeHeaders);

    // make a array of all the revisions that still exist as spinoffs
    let revisionsToPreserve = programsHeaders.reduce((set, revisionId) => {
        if(revisionId) set.add(revisionId.currentrevisionid);

        return set;
    }, new Set());

    revisionsToPreserve.add(codeHeaders.currentrevisionid); // don't remove the current revision ever

    // any revisions that don't need to be preserved should be considered stale
    return historyProgramResult.merges.filter(mergeRecord => {
        return !mergeRecord.codeDeleted && !revisionsToPreserve.has(mergeRecord.revisionId);
    });
}

async function cleanupOldRevisions(cookies, programId, codeHeaders=null, historyProgramResult=null) {
    // get required resources if not provided
    if(!codeHeaders) codeHeaders = (await getProgramCodeAndHeaders(programId)).codeHeaders;
    if(!historyProgramResult) historyProgramResult = await loadProgramHistory(codeHeaders.historyprogramid);

    // get all the stale revisions
    const staleRevisions = await getStaleRevisions(programId, codeHeaders, historyProgramResult);

    // delete all the stale revisions
    const staleMergeRecords = historyProgramResult.merges.filter(merge => {
        return staleRevisions.includes(merge.revisionId); // return the merge records that are stale
    });

    // delete the programs containing the stale code
    const programsToDelete = staleMergeRecords.map(mergeRecord => mergeRecord.codePointer);
    await Promise.all(programsToDelete.map(programToDelete => deleteProgram(cookies, programToDelete)));

    // now clean up bad pointers
    historyProgramResult.merges = historyProgramResult.merges.map(mergeRecord => {
        if(staleRevisions.includes(mergeRecord.revisionId)) { // if this merge record is stale
            // mark it as such
            mergeRecord.codePointer = null;
            mergeRecord.codeDeleted = true;
        }

        return mergeRecord;
    });

    // update the code headers
    await updateProgramHistory(cookies, codeHeaders.historyprogramid, historyProgramResult);

    return staleRevisions; // return the revisions removed
}

module.exports = {
    getStaleRevisions,
    cleanupOldRevisions
};

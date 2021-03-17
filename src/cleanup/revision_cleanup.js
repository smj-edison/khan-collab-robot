const {getSpinoffs, getProgramJSON} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../metadata/programs.js");

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
    const programs = await Promise.all(programsToKeep.map(program => getProgramCodeAndHeaders(program.programId)));
    const programsHeaders = programs.map(program => program.codeHeaders);

    // make a array of all the revisions that still exist as spinoffs
    let revisionsToPreserve = programsHeaders.reduce((set, revisionId) => {
        if(revisionId) set.add(revisionId.currentrevisionid);

        return set;
    }, new Set());

    revisionsToPreserve.add(codeHeaders.currentrevisionid); // don't remove the current revision ever

    // any revisions that don't need to be preserved should be considered stale
    return historyProgramResult.merges.map(merge => merge.revisionId).filter(revisionId => {
        return !revisionsToPreserve.has(revisionId);
    });
}



module.exports = {
    getStaleRevisions
};

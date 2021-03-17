const {getSpinoffs} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../metadata/programs.js");

async function getStaleRevisions(programId, programHeaders) {
    // first, list all the spinoffs of the main program (the branches)
    const programSpinoffs = (await getSpinoffs(programId)).scratchpads;

    // use the kaids to figure out which programs are owned by contributors
    const spinoffKaids = programSpinoffs.map(spinoff => {return {
        kaid: spinoff.authorKaid,
        programId: spinoff.url.match(/\d+(?=\?)/)[0] // get program id
    }});
    const contributors = codeHeaders.contributors ? codeHeaders.contributors.split(",") : [];

    // union spinoff kaids and contributors
    const programsToCheck = spinoffKaids.filter(value => contributors.includes(value.kaid));

    // load all the programs to check
    const programs = await Promise.all(programsToCheck.map(program => getProgramCodeAndHeaders(program.programId)));
    const programHeaders = programs.map(program => program.codeHeaders);

    // finally, make a list of all the revisions that still exist as spinoffs
    let revisionsToSave = programHeaders.reduce((set, revisionId) => {
        if(revisionId) set.add(revisionId);

        return set;
    }, new Set());

    return revisionsToSave.toArray();
}

module.exports = {
    getStaleRevisions
};

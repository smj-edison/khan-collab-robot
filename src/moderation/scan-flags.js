const {getProgramJSON} = require("ka-api").programs;
const { getUserPrograms, getUserProgramsAuthenticated } = require("ka-api").profile;

const { extractProgramIdFromURL } = require("../util/util.js");

const cascadeDeleteProgram = require("../commands/deleteprogram/cascadeDeleteProgram");

function findShadowbannedPrograms(anonymousResults, authenticatedResults) {
    if(anonymousResults.scratchpads.length > 0) { // if not all programs were banned (due to profile ban)
        return authenticatedResults.scratchpads.filter(scratchpad => {
            return !anonymousResults.scratchpads.find(result => extractProgramIdFromURL(result.url) === extractProgramIdFromURL(scratchpad.url));
        }).map(program => {
            return extractProgramIdFromURL(program.url);
        });
    }

    return [];
}

async function scanFlags(cookies) {
    const KAID = process.env.BOT_KAID;

    // part 1, detect shadowbanned programs
    const [anonymousPrograms, authenticatedPrograms] = await Promise.all([
        getUserPrograms(KAID),
        getUserProgramsAuthenticated(cookies, KAID)
    ]);

    const shadowbanned = findShadowbannedPrograms(anonymousPrograms, authenticatedPrograms);

    // part 2, check flags
    // no need to check authenticatedPrograms, go off of anonymous programs
    const programs = await Promise.all(anonymousPrograms.scratchpads.map(program => getProgramJSON(extractProgramIdFromURL(program.url))));
    
    const suspiciousPrograms = programs.filter(programJson => {
        let flags = programJson.flags.length;
        let votes = programJson.sumVotesIncremented;

        return flags >= 2 && (flags / votes) > 0.1;
    }).map(program => extractProgramIdFromURL(program.url));

    const toDelete = [
        ...shadowbanned,
        ...suspiciousPrograms
    ];

    await Promise.all(toDelete.map(program => cascadeDeleteProgram(cookies, program)));
}

module.exports = scanFlags;

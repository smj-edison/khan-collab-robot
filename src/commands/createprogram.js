const {updateProgramHeaders} = require("../metadata/programs");
const {generateProgramHeaders} = require("../metadata/program_header");
const PROGRAM_DEFAULT_JSON = require("../constants").PROGRAM_SAVE_JSON_DEFAULT;
const yargs = require('yargs/yargs');

async function createprogram(args, kaid, cookies) {
    var args = yargs(args)
        .choices("type", ["pjs", "webpage", "sql"]).alias("t", "type").default("type", "pjs").argv;

    // create the program
    const programResult = await newProgram(cookies, "Put code here\n\n\n" + generateProgramHeaders({
        author: kaid
    }, args.type), {
        title: args._.length > 0 ? args._.join(" ") : "New program",
        translatedTitle: args._.length > 0 ? args._.join(" ") : "New program",
    }, args.type);

    // as well as a history file
    const historyProgramResult = await newProgram(cookies, "{}", {
        title: `${programResult.data.id} history`
    });

    // set the program's historyprogramid to the history program
    await updateProgramHeaders(cookies, programResult.data.id, headers => {
        headers.historyprogramid = historyProgramResult.data.id;
    });

    return `Your program is here: https://www.khanacademy.org${programResult.data.relativeUrl}`;
}

module.exports = createprogram;
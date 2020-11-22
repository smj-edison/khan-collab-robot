const {newProgram, changeProgramHeaders} = require("../programs");
const {generateProgramHeaders} = require("../program_header");
const PROGRAM_DEFAULT_JSON = require("../constants").PROGRAM_SAVE_JSON_DEFAULT;
const yargs = require('yargs/yargs');

async function createprogram(args, kaid, cookies) {
    var args = yargs(args)
        .count("width").alias("w", "width").default("width", 400)
        .count("height").alias("h", "height").default("height", 400)
        .choices("type", ["pjs", "webpage", "sql"]).alias("t", "type").default("type", "pjs").argv;

    // create the program
    const programResult = await newProgram(cookies, generateProgramHeaders({
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
    await changeProgramHeaders(cookies, programResult.data.id, headers => {
        headers.historyprogramid = historyProgramResult.data.id;
    });

    return `Your program is here: https://www.khanacademy.org${programResult.data.relativeUrl}`;
}

module.exports = createprogram;
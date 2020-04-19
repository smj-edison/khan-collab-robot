const {newProgram, changeProgramHeaders} = require("../programs");
const {generateProgramHeaders} = require("../program_header");

async function createprogram(args, kaid, cookies) {
    // create the program
    const programResult = await newProgram(cookies, generateProgramHeaders({
        author: kaid
    }));

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
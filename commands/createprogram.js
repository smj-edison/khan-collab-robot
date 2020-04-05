const {newProgram} = require("../programs");

async function createprogram(args, kaid, cookies) {
    const programResult = await newProgram(cookies, `//author: ${kaid}`);
    return `Your program is here: https://www.khanacademy.org${programResult.data.relativeUrl}`;
}

module.exports = createprogram;
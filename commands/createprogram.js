const {newProgram} = require("../programs");

async function createprogram(args, kaid, cookies) {
    await newProgram(cookies, `//author: ${kaid}`);
}

module.exports = createprogram;
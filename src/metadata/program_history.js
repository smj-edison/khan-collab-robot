const {updateProgram} = require("ka-api").programs;

const {getProgramJSON} = require("./programs");

async function loadProgramHistory(programId) {
    const programJson = await getProgramJSON(programId);

    return JSON.parse(programJson.revision.code);
}

async function updateProgramHistory(cookies, programId, json) {
    return await updateProgram(cookies, programId, JSON.stringify(json));
}

module.exports = {
    loadProgramHistory,
    updateProgramHistory
};

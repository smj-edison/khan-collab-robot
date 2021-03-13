const {spinOffProgramCodeAndHeaders} = require("../../metadata/programs.js");

async function conflictedMerge(cookies, programBranchId, newCode, newHeaders) {
    newHeaders.conflict = "true";
    newHeaders.conflictedbranch = programBranchId;

    const result = await spinOffProgramCodeAndHeaders(cookies, programBranchId, newHeaders, newCode);

    return `Your program has a conflict. Please resolve and spin-off at https://www.khanacademy.org${result.data.relativeUrl}`;
}

module.exports = conflictedMerge;

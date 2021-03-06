const {getKaidFromUsername} = require("../profile");
const {getProgramCodeAndHeaders, updateProgramCodeAndHeaders} = require("../metadata/programs");
const {isAuthor} = require("../authorization/authorization");

async function addContributor(args, kaid, cookies) {
    const newContributor = args[0];
    const programId = args[1];

    const newContributorKaid = await getKaidFromUsername(cookies, newContributor);
    const {codeHeaders, code} = await getProgramCodeAndHeaders(programId);

    if(!isAuthor(codeHeaders, kaid)) {
        return "You are not the author. You cannot add contributors.";
    }

    let contributors = codeHeaders.contributors ? codeHeaders.contributors.split(",") : [];

    if(!contributors.includes(newContributorKaid)) {
        contributors.push(newContributorKaid);
    }

    codeHeaders.contributors = contributors.join(",");

    await updateProgramCodeAndHeaders(cookies, programId, codeHeaders, code);

    return newContributor + " added as a contributor.";
}

async function contrib(args, kaid, cookies) {
    switch(args[0]) {
        case "add":
            return addContributor(args.slice(1), kaid, cookies);
        break;
    }
}

module.exports = contrib;

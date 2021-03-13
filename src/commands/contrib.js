const {getProfileInfo} = require("ka-api").profile;
const {getProgramCodeAndHeaders, updateProgramCodeAndHeaders} = require("../metadata/programs");
const {isAuthor} = require("../authorization/authorization");

const {CommandError} = require("../error/command_error.js");

async function getKaidFromUsername(cookies, username) {
    return getProfileInfo(cookies, username).then(result => {
        if(Object.is(result.data.user, null)) {
            throw new CommandError(`The username "${username}" does not exist. Make sure that you have the user's username and not their display name.`);
        }

        return result.data.user.kaid;
    });
}

async function addContributor(cookies, args, kaid) {
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

async function contrib(cookies, args, kaid) {
    switch(args[0]) {
        case "add":
            return addContributor(cookies, args.slice(1), kaid);
        break;
    }
}

module.exports = contrib;

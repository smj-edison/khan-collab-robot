const axios = require("axios");
const {cookiesToCookieString} = require("./cookies");
const {makePostRequest} = require("./session");
const {CommandError} = require("./command_error");
const {GET_FULL_USER_PROFILE_QUERY} = require("./constants");

async function getKaidFromUsername(cookies, username) {
    let body = {
        "operationName": "getFullUserProfile",
        "variables": {"username": username},
        "query": GET_FULL_USER_PROFILE_QUERY
    };

    let url = "https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?lang=en";

    return makePostRequest(url, body, cookies).then(result => {
        if(Object.is(result.data.data.user, null)) {
            throw new CommandError(`The username "${username}" does not exist. Make sure that you have the user's username and not their display name.`);
        }

        return result.data.data.user.kaid;
    });
}

module.exports = {
    getKaidFromUsername
};

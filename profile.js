const axios = require("axios");
const {cookiesToCookieString} = require("./cookies");
const {GET_FULL_USER_PROFILE_QUERY} = require("./constants");

async function getKaidFromUsername(username) {
    let body = {
        "operationName": "getFullUserProfile",
        "variables": {"username": username},
        "query": GET_FULL_USER_PROFILE_QUERY
    };

    let url = "https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?lang=en";

    return axios.post(url, body).then(result => {
        return result.data.data.user.kaid;
    });
}

module.exports = {
    getKaidFromUsername
};

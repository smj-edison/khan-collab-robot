const axios = require("axios");
const qs = require("qs");

/**
 * Load khanacademy.org and return a list of all the cookies
**/
function getSessionCookies() {
    return axios.get("https://khanacademy.org").then((result) => {
        return result.headers["set-cookie"];
    }, {withCredentials: true});
}

/**
 * logs in a user, based on their username, password, and the cookies from `getSessionCookies()`
 * @returns an array of set-cookie headers from the server
**/
async function login(username, password, cookies) {
    return axios.post("https://www.khanacademy.org/login", qs.stringify({
        "identifier": username,
        "password": password,
        "fkey": cookieHelper.getCookieValue(cookies, "fkey"),
        "continue": "/"
    }), { withCredentials: true }).then((result) => {
        return result.headers["set-cookie"];
    });
}

module.exports = {
    getSessionCookies,
    login
};

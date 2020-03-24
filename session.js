const axios = require("axios");
const qs = require("qs");

//load khanacademy.org and return a list of all the cookies
function getSessionCookies() {
    return axios.get("https://khanacademy.org").then((result) => {
        return result.headers["set-cookie"];
    }, {withCredentials: true});
}

//logs in a user, based on their username, password, and the cookies from `getSessionCookies()`
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

const axios = require("axios");
const qs = require("qs");
const cookieHelper = require("./cookies.js");
const {cookiesToCookieString, getCookieValue} = require("./cookies");

/**
 * Make a GET request with the proper authentication on Khan Academy
 * 
 * @param {string} url The url on Khan Academy to make the GET request
 * @param {Array} cookies A list of cookies returned from a axios's request (set-cookie header)
 */
async function makeGetRequest(url, cookies) {
    return axios.get(url, {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    });
}

/**
 * Make a POST request with the proper authentication on Khan Academy
 * 
 * @param {string} url The url on Khan Academy to make the POST request
 * @param {object} body The JSON body of the POST request
 * @param {Array} cookies A list of cookies returned from a axios's request (set-cookie header)
 */
async function makePostRequest(url, body, cookies) {
    return axios.post(url, body, {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    });
}

/**
 * Make a PUT request with the proper authentication on Khan Academy
 * 
 * @param {string} url The url on Khan Academy to make the PUT request
 * @param {object} body The JSON body of the PUT request
 * @param {Array} cookies A list of cookies returned from a axios's request (set-cookie header)
 */
async function makePutRequest(url, body, cookies) {
    return axios.put(url, body, {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    });
}

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
async function loginWithCookies(username, password, cookies) {
    return axios.post("https://www.khanacademy.org/login", qs.stringify({
        "identifier": username,
        "password": password,
        "fkey": cookieHelper.getCookieValue(cookies, "fkey"),
        "continue": "/"
    }), { withCredentials: true }).then((result) => {
        return result.headers["set-cookie"];
    });
}

async function login(username, password) {
    let sessionCookies = await getSessionCookies();
    let loginCookies = await loginWithCookies(username, password, sessionCookies);
    let cookies = cookieHelper.mergeCookies(sessionCookies, loginCookies);

    return cookies;
}

module.exports = {
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    getSessionCookies,
    login
};

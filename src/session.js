const axios = require("axios");
const qs = require("qs");
const cookieHelper = require("./cookies.js");
const {LOGIN_QUERY} = require("./constants.js");
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
 * Make a DELETE request with the proper authentication on Khan Academy
 * 
 * @param {string} url The resource to delete
 * @param {Object} cookies A list of cookies returned from a axios's request (set-cookie header)
 */
async function makeDeleteRequest(url, cookies) {
    return axios.delete(url, {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    })
}

const FKeyChars = "0123456789abcdefghijklmnopqrstuvwxyz";

/**
 * Generates a FKey for a khan session
 */
function generateFKey() {
    var chars = "";

    for(var i = 0; i < 68; i++) {
        chars += FKeyChars[Math.floor(Math.random() * FKeyChars.length)];
    }

    return `1.0_${chars}_${Date.now()}`;
}

/**
 * Load khanacademy.org and return a list of all the cookies
**/
function getSessionCookies() {
    return axios.get("https://khanacademy.org/login").then((result) => {
        return result.headers["set-cookie"];
    }, {withCredentials: true});
}

/**
 * logs in a user, based on their username, password, and the cookies from `getSessionCookies()`
 * @returns an array of set-cookie headers from the server
**/
async function loginWithCookiesOld(username, password, cookies) {
    return axios.post("https://www.khanacademy.org/login", qs.stringify({
        "identifier": username,
        "password": password,
        "fkey": cookieHelper.getCookieValue(cookies, "fkey"),
        "continue": "/"
    }), { withCredentials: true }).then((result) => {
        return result.headers["set-cookie"];
    });
}

// fkey format: 1.0_[68 characters consisting of lowercase letters and numbers]_[timestamp]
async function loginWithCookies(username, password, cookies) {
    return axios.post("https://www.khanacademy.org/api/internal/graphql/loginWithPasswordMutation", {
        "operationName": "loginWithPasswordMutation",
        "variables": {
            "identifier": username,
            "password": password
        },
        "query": LOGIN_QUERY
    }, { 
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "user-agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/83.0",
            "x-ka-fkey": cookieHelper.getCookieValue(cookies, "fkey"),
            "Referer": "https://www.khanacademy.org/",
            "Origin": "https://www.khanacademy.org",
            "Accept-Language": "en-US,en;q=0.5"
        }
    }).then((result) => {
        return result.headers["set-cookie"];
    });
}

async function login(username, password) {
    if(username === undefined || password === undefined) {
        throw "Username and or password missing!";
    }

    let sessionCookies = await getSessionCookies();

    sessionCookies.push(`fkey=${generateFKey()}; expires=${(new Date()).toUTCString()}; path=/`);

    let loginCookies = await loginWithCookies(username, password, sessionCookies);
    let cookies = cookieHelper.mergeCookies(sessionCookies, loginCookies);

    return cookies;
}

module.exports = {
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest,
    getSessionCookies,
    login
};

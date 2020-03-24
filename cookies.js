function cookiesToCookieString(cookies) {
    return cookies.map((cookie) => {
        return cookie.substring(0, cookie.indexOf(";"));
    }).join("; ");
};

function getCookieValue(cookies, cookieName) {
    var cookie = cookies.find(cookie => {
        return cookie.indexOf(cookieName) === 0;
    });

    return cookie.substring(cookie.indexOf("=") + 1, cookie.lastIndexOf("; "));
}

function cookieToKeyValue(cookie) {
    var cookieKey = cookie.substring(0, cookie.indexOf("="));

    return [cookieKey, cookie.substring(cookieKey.length + 1)];
}

function mergeCookies(oldCookies, newCookies) {
    var cookies = {};

    oldCookies.map(cookieToKeyValue).forEach(cookie => {
        cookies[cookie[0]] = cookie[1];
    });

    newCookies.map(cookieToKeyValue).forEach(cookie => {
        cookies[cookie[0]] = cookie[1];
    });

    var cookiesArray = [];

    for(var i in cookies) {
        cookiesArray.push(i + "=" + cookies[i]);
    }

    return cookiesArray;
}

//create a configuration for axios requests with all the `cookies` provided
function genCookieHeader(cookies) {
    return {
        headers: {
            Cookie: cookieHelper.cookiesToCookieString(cookies)
        }
    }
}

module.exports = {
    cookiesToCookieString,
    getCookieValue,
    cookieToKeyValue,
    mergeCookies,
    genCookieHeader
};
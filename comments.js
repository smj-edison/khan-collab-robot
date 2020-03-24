const axios = require("axios");
const {makePostRequest} = require("./session");

async function commentAtRoot(commentURL, text, cookies) {
    var commentJSON = {
        "fromVideoAuthor": false,
        "shownLowQualityNotice": false,
        "text": text,
        "topic_slug": "computer-programming"
    }

    makePostRequest(`${commentURL}?casing=camel&lang=en&_=190828-1155-f259d8dcd107_${Date.now()}`, commentJSON, cookies);
};

module.exports = {
    commentAtRoot
};

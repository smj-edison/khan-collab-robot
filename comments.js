const axios = require("axios");
const {makePostRequest} = require("./session");

async function commentAtRoot(programId, text, cookies) {
    var commentJSON = {
        "fromVideoAuthor": false,
        "shownLowQualityNotice": false,
        "text": text,
        "topic_slug": "computer-programming"
    }

    let url = `https://www.khanacademy.org/api/internal/discussions/scratchpad/${programId}/comments?casing=camel&lang=en&_=190828-1155-f259d8dcd107_${Date.now()}`;
    makePostRequest(url, commentJSON, cookies);
};

module.exports = {
    commentAtRoot
};

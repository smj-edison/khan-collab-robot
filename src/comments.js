const axios = require("axios");
const {makePostRequest} = require("./session");
const {cookiesToCookieString, getCookieValue} = require("./cookies");

async function commentAtRoot(programId, text, cookies) {
    var commentJSON = {
        "fromVideoAuthor": false,
        "shownLowQualityNotice": false,
        "text": text,
        "topic_slug": "computer-programming"
    }

    let url = `https://www.khanacademy.org/api/internal/discussions/scratchpad/${programId}/comments?casing=camel&lang=en&_=190828-1155-f259d8dcd107_${Date.now()}`;
    makePostRequest(url, commentJSON, cookies);
}

async function commentOnComment(commentId, text, cookies) {
    var commentJSON = {
        "text": text,
        "topic_slug": "computer-programming"
    }

    let url = `https://www.khanacademy.org/api/internal/discussions/${commentId}/replies?casing=camel&lang=en`;
    makePostRequest(url, commentJSON, cookies);
}

async function getProgramComments(programId) {
    let url = `https://www.khanacademy.org/api/internal/discussions/scratchpad/${programId}/comments?casing=camel&limit=1000000&page=0&sort=1&lang=en`;
    
    return axios.get(url).then(response => {
        return response.data;
    });
}

async function getProgramCommentDetails(programId, commentExpandKey) {
    let url = `https://www.khanacademy.org/api/internal/discussions/scratchpad/${programId}/comments?casing=camel&qa_expand_key=${commentExpandKey}&lang=en`;

    return axios.get(url).then(response => {
        return response.data;
    });
}

async function getCommentsOnComment(commentId) {
    let url = `https://www.khanacademy.org/api/internal/discussions/${commentId}/replies?casing=camel&lang=en`;
    
    return axios.get(url).then(response => {
        return response.data;
    });
}

async function deleteRootComment(cookies, commentKaencrypted) {
    const url = `https://www.khanacademy.org/api/internal/feedback/${commentKaencrypted}?lang=en`;

    return axios.delete(url, {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    });
}

module.exports = {
    commentAtRoot,
    commentOnComment,
    getProgramComments,
    getProgramCommentDetails,
    getCommentsOnComment,
    deleteRootComment
};

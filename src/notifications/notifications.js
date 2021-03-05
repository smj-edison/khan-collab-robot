const {makeGetRequest} = require("./session");
const axios = require("axios");
const {cookiesToCookieString, getCookieValue} = require("./cookies");
const {markDiscussionOld} = require("../cleanup/discussion_culling.js");

async function parseNotificationJSON(json) {
    var notificationType = json.class_[json.class_.length - 1];

    // ignore direct comments (as they can't be cascade deleted)
    if(notificationType === "ResponseFeedbackNotification") {
        let {post, posts} = await getNotificationPost(json);

        const programId = json.url.match(/\d+(?=\?)/)[0];

        return {
            type: "response-feedback",
            parentCommentId: json.feedbackHierarchy[1],
            commentId: json.feedbackHierarchy[0],
            value: json.content,
            kaid: post.authorKaid,
            programId: programId,
            postsInDiscussion: posts.length
        };
    }

    return null;
}

async function getAndParseNewNotifications(cookies) {
    const notifications = await getBrandNewNotifications(cookies);
    const clearNotifPromise = clearNewNotifications(cookies);

    // no need to wait for the response for calculation this
    const parsedNotifs = (await Promise.all(notifications.map(parseNotificationJSON))).filter(notif => notif !== null);

    await Promise.all(parsedNotifs.map(async notif => {
        // clean up long discussions
        await markDiscussionOld(cookies, notif.postsInDiscussion, notif.programId, notif.parentCommentId);
    }));

    await clearNotifPromise;
    return parsedNotifs;
}

module.exports = {
    getBrandNewNotifications,
    clearNewNotifications,
    getAndParseNewNotifications
};

const {makeGetRequest} = require("./session");
const axios = require("axios");
const {cookiesToCookieString, getCookieValue} = require("./cookies");
const {markDiscussionOld} = require("./discussion_culling.js");

async function getRootComment(programId, commentId) {
    const url = `https://www.khanacademy.org/api/internal/discussions/scratchpad/${programId}/comments?casing=camel&lang=en&qa_expand_key=${commentId}`;

    return axios.get(url).then(response => response.data);
}

async function getCommentsOnAComment(comment) {
    const url = `https://www.khanacademy.org/api/internal/discussions/${comment}/replies?casing=camel&lang=en`;

    return axios.get(url).then(response => response.data);
}

async function getNotificationsRequest(cookies, cursor) {
    let cursorString = cursor ? `&cursor=${cursor}` : "";
    let url = `https://www.khanacademy.org/api/internal/user/notifications/readable?casing=camel${cursorString}&_=200324-0901-e040f1fb5249_${Date.now()}`;

    return makeGetRequest(url, cookies)
                .then(response => {
                    return response.data;
                });
}

async function getNotificationPost(notification) {
    let {feedbackHierarchy} = notification;

    let comments = await getCommentsOnAComment(feedbackHierarchy[feedbackHierarchy.length - 1]);

    return {
        post: comments.find(comment => comment.expandKey === notification.feedback),
        posts: comments
    };
}

async function getBrandNewNotifications(cookies) {
    let currentCursor;
    let notifications = [];

    do {
        const response = await getNotificationsRequest(cookies, currentCursor);
        const cursor = response.cursor;
        let notifs = response.notifications;

        // check if there are new notifications
        if(notifs[notifs.length - 1].brandNew) {
            currentCursor = cursor;
        } else {
            currentCursor = null;
        }

        notifications.push(...notifs.filter(notif => {
            return notif.brandNew;
        }));
    } while(currentCursor);

    return notifications;
}

async function clearNewNotifications(cookies) {
    const url = "https://www.khanacademy.org/api/internal/user/notifications/clear_brand_new?lang=en";

    return axios.post(url, "", {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    });
}

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

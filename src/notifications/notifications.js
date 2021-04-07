const {getAllBrandNewNotifications, clearBrandNewNotifications, getNotificationsUntil} = require("ka-api").notifications;
const {getNotificationCommentDetails} = require("ka-api").notifications;
const {checkAndMarkDiscussionOld} = require("../cleanup/discussion_culling.js");

async function parseNotificationJSON(notifJson) {
    const notificationType = notifJson.class_[notifJson.class_.length - 1];

    // ignore direct comment notifications (as they can't be cascade deleted)
    if(notificationType === "ResponseFeedbackNotification") {
        let {post, posts} = await getNotificationCommentDetails(notifJson);

        const programId = notifJson.url.match(/\d+(?=\?)/)[0];

        return {
            type: "response-feedback",
            parentCommentId: notifJson.feedbackHierarchy[1],
            commentId: notifJson.feedbackHierarchy[0],
            value: notifJson.content,
            kaid: post.authorKaid,
            programId: programId,
            postsInDiscussion: posts.length
        };
    }

    return null;
}

async function parseNotifications(notifications) {
    // parsing has to make get requests to read the notifications, so the map is promisified
    return parsedNotifs = (await Promise.all(notifications.map(parseNotificationJSON))).filter(notif => notif !== null);
}

async function parseNotificationsAndCleanup(notifications) {
    const clearNotifPromise = clearBrandNewNotifications(cookies);

    const parsedNotifs = await parseNotifications(notifications);

    await Promise.all(parsedNotifs.map(async notif => {
        // clean up long discussions TODO: move to a more transparent place
        await checkAndMarkDiscussionOld(cookies, notif.postsInDiscussion, notif.programId, notif.parentCommentId);
    }));

    await clearNotifPromise; // make sure the notifications are cleared

    return parsedNotifs;

}

async function getAndParseBrandNewNotifications(cookies) {
    const notifications = await getAllBrandNewNotifications(cookies);
    
    return await parseNotificationsAndCleanup(notifications);
}

async function getAndParseNewNotificationsAfterDate(cookies, date) {
    const notifications = await getNotificationsUntil(cookies, notif => {
        const notifDate = new Date(notif.date);

        return notifDate > date; // the comment should be after the date
    });
    
    return await parseNotificationsAndCleanup(notifications);
}

module.exports = {
    getAndParseBrandNewNotifications,
    getAndParseNewNotificationsAfterDate
};

const {commentOnComment} = require("ka-api").discussion;

const {runCommand} = require("../command_router");
const {getAndParseBrandNewNotifications, getAndParseNewNotificationsAfterDate} = require("../notifications/notifications.js");
const {getState, modifyState} = require("../state/state.js");

async function getLastNotificationDate() {
    let state = await getState();
    let lastNotificationDate;

    if(state.polling && state.polling.lastNotificationDate) {
        lastNotificationDate = state.polling.lastNotificationDate;
    }

    return lastNotificationDate ? new Date(lastNotificationDate) : undefined;
}

async function pollCommandsFromNotifications(cookies) {
    let lastNotificationDate = await getLastNotificationDate();

    let notifications;

    if(lastNotificationDate) {
        notifications = await getAndParseNewNotificationsAfterDate(cookies, lastNotificationDate);
    } else {
        notifications = await getAndParseBrandNewNotifications(cookies);
    }

    const mostRecentNotification = notifications[0];

    if(mostRecentNotification) {
        await modifyState(state => {
            if(!state.polling) {
                state.polling = {};
            }

            state.polling.lastNotificationDate = mostRecentNotification.date;
        })
    }

    for(let i = 0; i < notifications.length; i++) {
        const text = notifications[i].value;
        const kaid = notifications[i].kaid;

        console.log(`Running command ${text} as user ${kaid}`);

        runCommand(cookies, text, kaid).then((function(response) {
            commentOnComment(cookies, this.commentId, response);
        }).bind({
            commentId: notifications[i].parentCommentId
        }));
    }
}

module.exports = {
    pollCommandsFromNotifications
};

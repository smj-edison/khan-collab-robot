const {commentOnComment} = require("ka-api").discussion;

const {runCommand} = require("../command_router");
const {getAndParseNewNotifications} = require("../notifications/notifications.js");

async function pollCommandsFromNotifications(cookies) {
    const notifications = await getAndParseNewNotifications(cookies);

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

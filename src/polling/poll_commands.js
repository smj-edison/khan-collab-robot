const {commentOnComment} = require("ka-api").discussion;

const {runCommand} = require("../command_router");
const {getAndParseNewNotifications} = require("../notifications/notifications.js");

async function pollCommandsFromNotifications(cookies) {
    const notifications = await getAndParseNewNotifications(cookies);

    for(let i = 0; i < notifications.length; i++) {
        const text = notifications[i].value;
        const kaid = notifications[i].kaid;

        console.log(`Running command ${text} as user ${kaid}`);

        runCommand(text, kaid, cookies).then((function(response) {
            commentOnComment(this.commentId, response, cookies);
        }).bind({
            commentId: notifications[i].parentCommentId
        }));
    }
}

module.exports = {
    pollCommandsFromNotifications
};

const {makeGetRequest} = require("./session");

async function getNotificationsRequest(cookies, cursor) {
    let cursorString = cursor ? `&cursor=${cursor}` : "";
    let url = `https://www.khanacademy.org/api/internal/user/notifications/readable?casing=camel${cursorString}&_=200324-0901-e040f1fb5249_${Date.now()}`;

    return makeGetRequest(url, cookies)
                .then(response => {
                    return response.data;
                });
}

async function getBrandNewNotifications(cookies) {
    let currentCursor;
    let notifications = [];

    do {
        const response = await getNotificationsRequest(cookies);
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

function parseNotificationJSON(json) {
    var notificationType = json.class_[json.class_.length - 1];

    if(notificationType === "ScratchpadFeedbackNotification") {
        return {
            type: "program-feedback",
            programId: json.scratchpadRelativeUrl.substring(json.scratchpadRelativeUrl.lastIndexOf("/") + 1)
        };
    }

    return null;
}

const {makeGetRequest} = require("./session");
const axios = require("axios");
const {cookiesToCookieString, getCookieValue} = require("./cookies");

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

async function clearNewNotifications(cookies) {
    const url = "https://www.khanacademy.org/api/internal/user/notifications/clear_brand_new?lang=en";

    return axios.post(url, "", {
        "headers": {
            "Cookie": cookiesToCookieString(cookies),
            "X-KA-FKey": getCookieValue(cookies, "fkey")
        }
    });
}

function parseNotificationJSON(json) {
    var notificationType = json.class_[json.class_.length - 1];

    if(notificationType === "ScratchpadFeedbackNotification") {
        return {
            type: "program-feedback",
            programId: json.scratchpadRelativeUrl.substring(json.scratchpadRelativeUrl.lastIndexOf("/") + 1),
            value: json.content
        };
    } else if(notificationType === "ResponseFeedbackNotification") {
        return {
            type: "response-feedback",
            commentId: json.feedbackHierarchy[1],
            value: json.content
        };
    }

    return null;
}

module.exports = {
    getBrandNewNotifications,
    clearNewNotifications
};

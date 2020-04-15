const {makeGetRequest} = require("./session");

async function getNotificationsRequest(cursor) {
    let cursorString = cursor ? `&cursor=${cursor}` : "";
    let url = `https://www.khanacademy.org/api/internal/user/notifications/readable?casing=camel${cursorString}&_=200324-0901-e040f1fb5249_${Date.now()}`;

    return makeGetRequest(url, cookies)
                .then(response => {
                    return response.data;
                });
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

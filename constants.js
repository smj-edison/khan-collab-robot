const PROGRAM_TYPE = Object.freeze({
    "pjs": "pjs",
    "webpage": "webpage",
    "sql": "sql"
});

const PROGRAM_HEADER_START_STRING_PJS = "// STARTPROGRAMHEADERS //";
const PROGRAM_HEADER_START_STRING_WEBPAGE = "<!-- STARTPROGRAMHEADERS -->";
const PROGRAM_HEADER_START_STRING_SQL = "-- STARTPROGRAMHEADERS --";

const MAX_DISCUSSION_LENGTH = 16;
const NEW_COMMENT_TEXT = "" +
`*Post commands in the comments here*

Tutorial is here: https://www.khanacademy.org/computer-programming/-/5972816126492672

Documentation is here: https://www.khanacademy.org/computer-programming/-/4624919749345280`;

const GET_FULL_USER_PROFILE_QUERY = "query getFullUserProfile($kaid: String, $username: String) {\n  user(kaid: $kaid, username: $username) {\n    id\n    kaid\n    key\n    userId\n    email\n    username\n    profileRoot\n    childPageRoot\n    gaUserId\n    qualarooId\n    isPhantom\n    isDeveloper: hasRole(name: \"admin\")\n    isCurator: hasRole(name: \"curator\", scope: ANY_ON_CURRENT_LOCALE)\n    isCreator: hasRole(name: \"creator\", scope: ANY_ON_CURRENT_LOCALE)\n    isPublisher: hasPermission(name: \"can_publish\", scope: ANY_ON_CURRENT_LOCALE)\n    isModerator: hasPermission(name: \"can_moderate_users\", scope: GLOBAL)\n    isPublic\n    isParent\n    isTeacher\n    isDataCollectible\n    isChild\n    isOrphan\n    isActivityAccessible\n    isCoachingLoggedInUser\n    isParentOfLoggedInUser\n    canModifyCoaches\n    nickname\n    hideVisual\n    joined\n    points\n    countVideosCompleted\n    publicBadges {\n      badgeCategory\n      description\n      isOwned\n      isRetired\n      name\n      points\n      absoluteUrl\n      hideContext\n      icons {\n        smallUrl\n        compactUrl\n        emailUrl\n        largeUrl\n        __typename\n      }\n      relativeUrl\n      safeExtendedDescription\n      slug\n      translatedDescription\n      translatedSafeExtendedDescription\n      __typename\n    }\n    bio\n    background {\n      name\n      imageSrc\n      __typename\n    }\n    schoolAffiliation {\n      id\n      name\n      postalCode\n      location\n      __typename\n    }\n    affiliationCountryCode\n    soundOn\n    muteVideos\n    prefersReducedMotion\n    noColorInVideos\n    autocontinueOn\n    avatar {\n      name\n      imageSrc\n      __typename\n    }\n    hasChangedAvatar\n    newNotificationCount\n    canHellban: hasPermission(name: \"can_ban_users\", scope: GLOBAL)\n    canMessageUsers: hasPermission(name: \"can_send_moderator_messages\", scope: GLOBAL)\n    canCreateOfficialClarifications: hasPermission(name: \"can_approve_clarifications\", scope: GLOBAL)\n    canEvalCsProjects\n    discussionBanned\n    isSelf: isActor\n    hasStudents\n    hasClasses\n    hasChildren\n    badgeCounts\n    homepageUrl\n    hasCoachHomepage\n    hasParentHomepage\n    isMidsignupPhantom\n    streakLastExtended\n    streakLastLength\n    __typename\n  }\n}\n";

const LOGIN_QUERY = "" +
`mutation loginWithPasswordMutation($identifier: String!, $password: String!) {
  loginWithPassword(identifier: $identifier, password: $password) {
    user {
      id
      kaid
      canAccessDistrictsHomepage
      isTeacher
      hasUnresolvedInvitations
      transferAuthUrl(pathname: "")
      preferredKaLocale {
        id
        kaLocale
        __typename
      }
      __typename
    }
    isFirstLogin
    error {
      code
      __typename
    }
    __typename
  }
}
`;

const STATE_FILE_LOCATION = "state.json";

const PROGRAM_SAVE_JSON_DEFAULT = {
    "contentKindCode": "p",
    "newUrlPath": "/computer-programming/new/pjs",
    "hideFromHotlist": false,
    "relativeUrl": "/computer-programming/new-program/0000000000000000",
    "originScratchpadId": null,
    "forkedFromTopic": "computer-programming",
    "projectEval": null,
    "height": 400,
    "canvasOnly": false,
    "originSimilarity": 0,
    "id": 0, //necessary
    "definitelyNotSpam": false,
    "editSlug": "edit/p/new-program",
    "category": null,
    "originRevisionId": null,
    "title": "New Program",
    "translatedProjectEval": null,
    "sendToPeers": false,
    "slug": "new-program", //the browserified part (e.g. https://www.khanacademy.org/computer-programming/[slug here]/0000000000000000 )
    "isChallenge": false,
    "width": 400,
    "projectEvalTips": null,
    "youtubeId": null,
    "docsUrlPath": "/computer-programming/pjs-documentation",
    "contentKind": "Scratchpad",
    "type": "scratchpad",
    "revision": {
        "tests": null,
        "code": "",
        "folds": [

        ],
        "translatedMp3Url": null,
        "mp3Url": null,
        "editorType": "ace_pjs",
        "playback": null,
        "youtubeId": null,
        "configVersion": 4,
        "editor_type": "ace_pjs",
        "image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFJklEQVR4Xu3VsRGAQAwEMei/6KcBINj0RO7A8u9wn3PO5SNA4FXgFoiXQeBbQCBeB4EfAYF4HgQE4g0QaAL+IM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpE4AEkfR3WLjIGnQAAAABJRU5ErkJggg==",
        "config_version": 4,
        "topic_slug": "computer-programming"
    },
    "tests": "",
    "imagePath": "/computer-programming/new-program/6689653680603136/4543406983184384.png",
    "nodeType": "scratchpad",
    "description": "",
    "isProject": false,
    "tags": [

    ],
    "translatedDescription": "",
    "byChild": false,
    "difficulty": null,
    "originIsProject": false,
    "key": "ag5zfmtoYW4tYWNhZGVteXIXCxIKU2NyYXRjaHBhZBiAgLb6xYbxCww",
    "date": "1970-01-01T00:00:00Z", // (new Date()).toISOString().substring(0, 19) + "Z"
    "nodeSlug": "p/new-program",
    "spinoffCount": 0,
    "kind": "Scratchpad",
    "termMap": {
        "new": "New Program",
        "restart": "Restart"
    },
    "created": "1970-01-01T00:00:00Z", // (new Date()).toISOString().substring(0, 19) + "Z"
    "url": "https://www.khanacademy.org/computer-programming/new-program/6689653680603136",
    "imageUrl": "https://www.khanacademy.org/computer-programming/new-program/6689653680603136/4543406983184384.png",
    "isPublished": false,
    "sumVotesIncremented": 1,
    "defaultUrlPath": null,
    "flags": [

    ],
    "isProjectOrFork": false,
    "translatedProjectEvalTips": null,
    "userAuthoredContentType": "pjs",
    "kaid": "kaid_0123456789", //the user who uploaded it
    "translatedTitle": "New Program",
    "trustedRevision": {
        "created": "1970-01-01T00:00:00.000Z" // (new Date()).toISOString()
    }
};

module.exports = {
    PROGRAM_SAVE_JSON_DEFAULT,
    LOGIN_QUERY,
    PROGRAM_HEADER_START_STRING_PJS,
    PROGRAM_HEADER_START_STRING_WEBPAGE,
    PROGRAM_HEADER_START_STRING_SQL,
    GET_FULL_USER_PROFILE_QUERY,
    STATE_FILE_LOCATION,
    MAX_DISCUSSION_LENGTH,
    NEW_COMMENT_TEXT
};

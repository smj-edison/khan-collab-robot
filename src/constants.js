const PROGRAM_TYPE = Object.freeze({
    "pjs": "pjs",
    "webpage": "webpage",
    "sql": "sql"
});

const PROGRAM_HEADER_START_STRING_PJS = "// STARTPROGRAMHEADERS //";
const PROGRAM_HEADER_START_STRING_WEBPAGE = "<!-- STARTPROGRAMHEADERS -->";
const PROGRAM_HEADER_START_STRING_SQL = "-- STARTPROGRAMHEADERS --";

const MAX_DISCUSSION_LENGTH = 16;
const TIME_UNTIL_DELETED = 1000 * 60 * 60 * 24;
const NEW_COMMENT_TEXT = "" +
`*Post commands in the comments here*

Tutorial is here: https://www.khanacademy.org/computer-programming/-/5972816126492672

Documentation is here: https://www.khanacademy.org/computer-programming/-/4624919749345280`;

const GET_FULL_USER_PROFILE_QUERY = "" +
`query getFullUserProfile($kaid: String, $username: String) {
  user(kaid: $kaid, username: $username) {
    id
    kaid
    key
    userId
    email
    username
    profileRoot
    gaUserId
    qualarooId
    isPhantom
    isDeveloper: hasPermission(name: "can_do_what_only_admins_can_do")
    isCurator: hasPermission(name: "can_curate_tags", scope: ANY_ON_CURRENT_LOCALE)
    isCreator: hasPermission(name: "has_creator_role", scope: ANY_ON_CURRENT_LOCALE)
    isPublisher: hasPermission(name: "can_publish", scope: ANY_ON_CURRENT_LOCALE)
    isModerator: hasPermission(name: "can_moderate_users", scope: GLOBAL)
    isPublic
    isParent
    isSatStudent
    isTeacher
    isDataCollectible
    isChild
    isOrphan
    isActivityAccessible
    isCoachingLoggedInUser
    canModifyCoaches
    nickname
    hideVisual
    joined
    points
    countVideosCompleted
    publicBadges {
      badgeCategory
      description
      isOwned
      isRetired
      name
      points
      absoluteUrl
      hideContext
      icons {
        smallUrl
        compactUrl
        emailUrl
        largeUrl
        __typename
      }
      relativeUrl
      safeExtendedDescription
      slug
      translatedDescription
      translatedSafeExtendedDescription
      __typename
    }
    bio
    background {
      name
      imageSrc
      __typename
    }
    soundOn
    muteVideos
    prefersReducedMotion
    noColorInVideos
    autocontinueOn
    avatar {
      name
      imageSrc
      __typename
    }
    hasChangedAvatar
    newNotificationCount
    canHellban: hasPermission(name: "can_ban_users", scope: GLOBAL)
    canMessageUsers: hasPermission(name: "can_send_moderator_messages", scope: GLOBAL)
    canEvalCsProjects
    discussionBanned
    isSelf: isActor
    hasStudents: hasCoachees
    hasClasses
    hasChildren
    hasCoach
    badgeCounts
    homepageUrl
    isMidsignupPhantom
    streakLastExtended
    streakLastLength
    includesDistrictOwnedData
    preferredKaLocale {
      id
      kaLocale
      status
      __typename
    }
    transferAuthUrl(pathname: "")
    __typename
  }
}
`;

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
    NEW_COMMENT_TEXT,
    TIME_UNTIL_DELETED
};

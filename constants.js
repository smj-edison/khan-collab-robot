const PROGRAM_TYPE = Object.freeze({
    "pjs": "pjs",
    "webpage": "webpage",
    "sql": "sql"
});

const PROGRAM_HEADER_END_STRING = "// ENDPROGRAMHEADERS //";

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
    PROGRAM_HEADER_END_STRING
};

const PROGRAM_TYPE = Object.freeze({
    "pjs": "pjs",
    "webpage": "webpage",
    "sql": "sql"
});

const PROGRAM_HEADER_START_STRING_PJS = "\n// STARTPROGRAMHEADERS //";
const PROGRAM_HEADER_START_STRING_WEBPAGE = "\n<!-- STARTPROGRAMHEADERS -->";
const PROGRAM_HEADER_START_STRING_SQL = "\n-- STARTPROGRAMHEADERS --";

const MAX_DISCUSSION_LENGTH = 16;
const TIME_UNTIL_DELETED = 1000 * 60 * 60 * 24;
const NEW_COMMENT_TEXT = "" +
`*Post commands in the comments here*

If you have any problems, post a message in the \`bug reports\` thread.
Documentation and tutorial is in the program above.`;

const STATE_FILE_LOCATION = "state.json";

module.exports = {
    PROGRAM_HEADER_START_STRING_PJS,
    PROGRAM_HEADER_START_STRING_WEBPAGE,
    PROGRAM_HEADER_START_STRING_SQL,
    STATE_FILE_LOCATION,
    MAX_DISCUSSION_LENGTH,
    NEW_COMMENT_TEXT,
    TIME_UNTIL_DELETED
};

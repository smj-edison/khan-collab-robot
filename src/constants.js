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

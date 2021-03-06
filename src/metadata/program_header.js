const {
    PROGRAM_HEADER_START_STRING_PJS,
    PROGRAM_HEADER_START_STRING_WEBPAGE,
    PROGRAM_HEADER_START_STRING_SQL
} = require("../constants");

function findStartIndex(code, type) {
    switch(type) {
        case "pjs":
            return code.indexOf(PROGRAM_HEADER_START_STRING_PJS) + PROGRAM_HEADER_START_STRING_PJS.length;
        case "webpage":
            return code.indexOf(PROGRAM_HEADER_START_STRING_WEBPAGE) + PROGRAM_HEADER_START_STRING_WEBPAGE.length;
        case "sql":
            return code.indexOf(PROGRAM_HEADER_START_STRING_SQL) + PROGRAM_HEADER_START_STRING_SQL.length;
    }
}

function parseHeadersPjs(headerString) {
    let headers = {};

    return headerString.split("\n").map(headerRow => {
        const commentIndex = headerRow.indexOf("//");
        
        // if the line has a "//"
        if(commentIndex > -1) {
            // split the line by a ":"
            const keyValueString = headerRow.substring(commentIndex + 2);
            const keyValue = keyValueString.split(":");

            const key = keyValue[0].trim();
            const value = decodeURIComponent(keyValue[1].trim());

            return [key, value];
        }

        // else, disregard line
    }).reduce((acc, val) => {acc[val[0]] = val[1]; return acc}, {}); // convert [["key", "value"]] to {"key": "value"}
}

function parseHeadersPjs(headerString) {
    return headerString.split("\n").map(headerRow => {
        const commentIndex = headerRow.indexOf("//");
        
        // if the line has a "//"
        if(commentIndex > -1) {
            // split the line by a ":"
            const keyValueString = headerRow.substring(commentIndex + 2);
            const keyValue = keyValueString.split(":");

            const key = keyValue[0].trim();
            const value = decodeURIComponent(keyValue[1].trim());

            return [key, value];
        }

        // else, disregard line
    }).reduce((acc, val) => {acc[val[0]] = val[1]; return acc}, {}); // convert [["key", "value"]] to {"key": "value"}
}

function parseHeadersWebpage(headerString) {
    return headerString.split("\n").map(headerRow => {
        const commentIndex = headerRow.indexOf("<!--");
        const endCommentIndex = headerRow.indexOf("-->");
        
        // if the line has a "<!--"
        if(commentIndex > -1) {
            // split the line by a ":"
            const keyValueString = headerRow.substring(commentIndex + 4, endCommentIndex);

            const keyValue = keyValueString.split(":");

            const key = keyValue[0].trim();
            const value = decodeURIComponent(keyValue[1].trim());

            return [key, value];
        }

        // else, disregard line
    }).reduce((acc, [key, value]) => {acc[key] = value; return acc}, {});
}

function parseHeadersSql(headerString) {
    return headerString.split("\n").map(headerRow => {
        const commentIndex = headerRow.indexOf("--");
        
        // if the line has a "--"
        if(commentIndex > -1) {
            // split the line by a ":"
            const keyValueString = headerRow.substring(commentIndex + 2);
            const keyValue = keyValueString.split(":");

            const key = keyValue[0].trim();
            const value = decodeURIComponent(keyValue[1].trim());

            return [key, value];
        }

        // else, disregard line
    }).reduce((acc, val) => {acc[val[0]] = val[1]; return acc}, {}); // convert [["key", "value"]] to {"key": "value"}
}

function parseProgramHeaders(code, type) {
    // find where the headers start
    let startOfHeaders = findStartIndex(code, type);

    let headerString;
    
    // if there's the start header string, delete everything before it (including it)
    if(startOfHeaders > -1) {
        headerString = code.substring(startOfHeaders, code.length).trim();
    } else {
        // just consider everything as a header
        headerString = code.trim();
    }

    // split the headers by each line
    switch(type) {
        case "pjs":
            return parseHeadersPjs(headerString);
        case "webpage":
            return parseHeadersWebpage(headerString);
        case "sql":
            return parseHeadersSql(headerString);
    }
}

function stripProgramHeaders(code, type) {
    switch(type) {
        case "pjs":
            return code.substring(0, code.indexOf(PROGRAM_HEADER_START_STRING_PJS));
        case "webpage":
            return code.substring(0, code.indexOf(PROGRAM_HEADER_START_STRING_WEBPAGE));
        case "sql":
            return code.substring(0, code.indexOf(PROGRAM_HEADER_START_STRING_SQL));
    }
}

function generateProgramHeaders(headers, type) {
    switch(type) {
        case "pjs":
            return PROGRAM_HEADER_START_STRING_PJS + "\n" + Object.entries(headers).reduce((str, [key, value]) => {
                return str + `//${key}: ${encodeURIComponent(value)}\n`;
            }, "");
        case "webpage":
            return PROGRAM_HEADER_START_STRING_WEBPAGE + "\n" + Object.entries(headers).reduce((str, [key, value]) => {
                return str + `<!--${key}: ${encodeURIComponent(value)}-->\n`;
            }, "");
        case "sql":
            return PROGRAM_HEADER_START_STRING_SQL + "\n" + Object.entries(headers).reduce((str, [key, value]) => {
                return str + `--${key}: ${encodeURIComponent(value)}\n`;
            }, "");
    }
}

module.exports = {
    parseProgramHeaders,
    generateProgramHeaders,
    stripProgramHeaders
};

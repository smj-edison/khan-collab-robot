const {
    PROGRAM_HEADER_START_STRING_PJS,
    PROGRAM_HEADER_START_STRING_WEBPAGE,
    PROGRAM_HEADER_START_STRING_SQL
} = require("./constants");

function parseProgramHeaders(code, type) {
    let startOfHeaders = null;

    switch(type) {
        case "pjs":
            startOfHeaders = code.indexOf(PROGRAM_HEADER_START_STRING_PJS) + PROGRAM_HEADER_START_STRING_PJS.length;
        break;
        case "webpage":
            startOfHeaders = code.indexOf(PROGRAM_HEADER_START_STRING_WEBPAGE) + PROGRAM_HEADER_START_STRING_WEBPAGE.length;
        break;
        case "sql":
            startOfHeaders = code.indexOf(PROGRAM_HEADER_START_STRING_SQL) + PROGRAM_HEADER_START_STRING_SQL.length;
        break;
    }

    let headerString;
    
    // if there's the start header string, delete everything before it (including it)
    if(startOfHeaders > -1) {
        headerString = code.substring(startOfHeaders, code.length).trim();
    } else {
        // just consider everything as a header
        headerString = code.trim();
    }

    let headers = {};

    // split the headers by each line

    switch(type) {
        case "pjs":
            headerString.split("\n").forEach(headerRow => {
                const commentIndex = headerRow.indexOf("//");
                
                // if the line has a "//"
                if(commentIndex > -1) {
                    // split the line by a ":"
                    const keyValueString = headerRow.substring(commentIndex + 2);
                    const keyValue = keyValueString.split(":");
        
                    const key = keyValue[0].trim();
                    const value = decodeURIComponent(keyValue[1].trim());
        
                    headers[key] = value;
                }
        
                // else, disregard line
            });
        break;
        case "webpage":
            headerString.split("\n").forEach(headerRow => {
                const commentIndex = headerRow.indexOf("<!--");
                const endCommentIndex = headerRow.indexOf("-->");
                
                // if the line has a "<!--"
                if(commentIndex > -1) {
                    // split the line by a ":"
                    const keyValueString = headerRow.substring(commentIndex + 4, endCommentIndex);

                    const keyValue = keyValueString.split(":");
        
                    const key = keyValue[0].trim();
                    const value = decodeURIComponent(keyValue[1].trim());
        
                    headers[key] = value;
                }
        
                // else, disregard line
            });
        break;
        case "webpage":
            headerString.split("\n").forEach(headerRow => {
                const commentIndex = headerRow.indexOf("--");
                
                // if the line has a "<!--"
                if(commentIndex > -1) {
                    // split the line by a ":"
                    const keyValueString = headerRow.substring(commentIndex + 2);
                    const keyValue = keyValueString.split(":");
        
                    const key = keyValue[0].trim();
                    const value = decodeURIComponent(keyValue[1].trim());
        
                    headers[key] = value;
                }
        
                // else, disregard line
            });
        break;
    }
    

    return headers;
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

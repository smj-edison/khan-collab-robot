const {PROGRAM_HEADER_END_STRING} = require("./constants");

function parseProgramHeaders(code) {
    const endOfHeaders = code.indexOf(PROGRAM_HEADER_END_STRING);
    let headerString;
    
    // if there's the end header string, delete everything after it
    if(endOfHeaders > -1) {
        headerString = code.substring(0, endOfHeaders).trim();
    } else {
        // just consider everything as a header
        headerString = code.trim();
    }

    let headers = {};

    // split the headers by each line
    headerString.split("\n").forEach(headerRow => {
        const slashslashIndex = headerRow.indexOf("//");
        
        // if the line has a "//"
        if(slashslashIndex > -1) {
            // split the line by a ":"
            const keyValueString = headerRow.substring(slashslashIndex + 2);
            const keyValue = keyValueString.split(":");

            const key = keyValue[0].trim();
            const value = decodeURIComponent(keyValue[1].trim());

            headers[key] = value;
        }

        // else, disregard line
    });

    return headers;
}

function stripProgramHeaders(code) {
    return code.substring(code.indexOf(PROGRAM_HEADER_END_STRING) + PROGRAM_HEADER_END_STRING.length);
}

function generateProgramHeaders(headers) {
    return Object.entries(headers).reduce((str, [key, value]) => {
        return str + `//${key}: ${encodeURIComponent(value)}\n`;
    }, "") + PROGRAM_HEADER_END_STRING;
}

module.exports = {
    parseProgramHeaders,
    generateProgramHeaders,
    stripProgramHeaders
};

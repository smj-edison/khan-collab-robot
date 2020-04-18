const fsp = require("fs").promises;
const {STATE_FILE_LOCATION} = require("./constants.js");

/**
 * getState returns the current value of the state json file.
 * @returns {Object} The parsed JSON from the state file
 */
async function getState() {
    return new Promise(resolve => {
        fsp.readFile(STATE_FILE_LOCATION).then(data => {
           resolve(JSON.parse(data)); 
        }).catch(() => {
            resolve({});
        });
    });
}

/**
 * setState writes the new state to the state file
 * @param {Object} json The JSON to write to the file
 */
async function setState(json) {
    return fsp.writeFile(STATE_FILE_LOCATION, JSON.stringify(json));
}

module.exports = {
    getState,
    setState
};

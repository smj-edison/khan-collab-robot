const fsp = require("fs").promises;
const {STATE_FILE_LOCATION} = require("./constants.js");

/**
 * getState returns the current value of the state json file.
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
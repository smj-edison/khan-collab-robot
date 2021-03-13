const fsp = require("fs").promises;
const {STATE_FILE_LOCATION} = require("../constants.js");
const {lock} = require("proper-lockfile");

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

/**
 * modifyState will modify the state file. It loads the state, executes the lambda
 * on the state, and then saves the state
 * 
 * @param {function} lambdaThatWillModifyState A lambda that should modify the state
 */
async function modifyState(lambdaThatWillModifyState) {
    return lock(STATE_FILE_LOCATION)
            .then(async function(release) {
                //get the state, modify it, and save it again
                let state = await getState();
                lambdaThatWillModifyState(state);
                await setState(state);
                
                release();

                return state;
            });
}

module.exports = {
    getState,
    setState,
    modifyState
};

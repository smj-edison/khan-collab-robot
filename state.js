const fsp = require("fs").promises;
const {STATE_FILE_LOCATION} = require("./constants.js");
const {lock, unlock} = require("lockfile");

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
    return new Promise(resolve, reject => {
        // keep the file locked so it isn't modified
        lock(STATE_FILE_LOCATION, async function(err) {
            if(err) reject(err); // reject if there were any errors

            //get the state, modify it, and save it again
            let state = await getState();
            lambdaThatWillModifyState(state);
            await setState(state);

            // unlock once all the operations are complete
            unlock(STATE_FILE_LOCATION, err => {
                if(err) reject(err);
                
                // resolve with the new state
                resolve(state);
            });
        });
    });
}

module.exports = {
    getState,
    setState,
    modifyState
};

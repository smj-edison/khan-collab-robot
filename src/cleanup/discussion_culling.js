const {MAX_DISCUSSION_LENGTH, NEW_COMMENT_TEXT, TIME_UNTIL_DELETED} = require("../constants.js");
const {modifyState, getState} = require("../state/state.js");
const {commentOnProgram, commentOnComment, deleteProgramComment, getProgramCommentDetails} = require("ka-api").discussion;

async function checkAndAddToQueue(programId, discussionParentExpandKey) {
    let shouldComment = true;

    await modifyState(state => {
        state.queuedDeletions = state.queuedDeletions ? state.queuedDeletions : [];
        
        // if it is already queued this thread, don't add it again
        if(state.queuedDeletions.find(queuedDeletion => queuedDeletion.discussionExpandKey === discussionParentExpandKey)) {
            shouldComment = false;
            return;
        }

        state.queuedDeletions.push({
            date: (new Date()).toISOString(),
            discussionExpandKey: discussionParentExpandKey,
            programId
        });

        state.queuedDeletions.sort((a, b) => a.date.localeCompare(b.date));
    });

    return shouldComment;
}

async function checkAndMarkDiscussionOld(cookies, discussionLength, programId, discussionParentExpandKey) {
    if(discussionLength > MAX_DISCUSSION_LENGTH) {

        // will be set to false if it already scheduled the thread to be deleted
        let shouldAddWarnMessage = await checkAndAddToQueue(programId, discussionParentExpandKey);

        if(shouldAddWarnMessage) {
            await Promise.all([
                commentOnComment(cookies, discussionParentExpandKey, "This thread will be deleted in 24 hours."),
                commentOnProgram(cookies, programId, NEW_COMMENT_TEXT)
            ]);
        }
    }
}


function hasDiscussionExpired(queuedDeletion) {
    let queuedDate = new Date(queuedDeletion.date);
    let queuedDateOffset = new Date(queuedDate.getTime() + TIME_UNTIL_DELETED);
    let now = new Date();
    
    return now > queuedDateOffset;
}

async function removeFromQueue(discussionExpandKey) {
    return modifyState(state => {
        state.queuedDeletions = state.queuedDeletions || [];

        const queuedDeletionIndex = state.queuedDeletions.findIndex(queuedDeletion => {
            return queuedDeletion.discussionExpandKey === discussionExpandKey;
        });

        state.queuedDeletions.splice(queuedDeletionIndex, 1);
    });
}

async function deleteQueuedDeletion(cookies, toDelete) {
    // get the comment's qaExpandKey
    const parentDetails = await getProgramCommentDetails(toDelete.programId, toDelete.discussionExpandKey);
    const commentKey = parentDetails.qaExpandKey;

    const deleteProgramPromise = deleteProgramComment(cookies, commentKey);

    // delete the queued comment from the state 
    const removeFromQueuePromise = removeFromQueue(toDelete.discussionExpandKey);

    await [
        deleteProgramPromise,
        removeFromQueuePromise
    ];
}

async function checkForAndDeleteOldDiscussions(cookies) {
    // get all discussions queued for deletion
    let queuedDeletions = (await getState()).queuedDeletions || [];

    // sort them by oldest to newest
    queuedDeletions.sort((a, b) => a.date.localeCompare(b.date));

    let waitFor = [];

    // go through until it reaches a queued deletion that hasn't expired
    while(queuedDeletions.length > 0 && hasDiscussionExpired(queuedDeletions[0])) {
        waitFor.push(deleteQueuedDeletion(cookies, queuedDeletions[0]));

        queuedDeletions.splice(0, 1);
    }

    await Promise.all(waitFor);
}



module.exports = {
    checkAndMarkDiscussionOld,
    checkForAndDeleteOldDiscussions
};

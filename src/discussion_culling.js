const {MAX_DISCUSSION_LENGTH, NEW_COMMENT_TEXT, TIME_UNTIL_DELETED} = require("./constants.js");
const {modifyState, getState} = require("./state.js");
const {commentAtRoot, commentOnComment, deleteRootComment, getProgramCommentDetails} = require("./comments.js");

async function markDiscussionOld(cookies, discussionLength, programId, discussionParentExpandKey) {
    if(discussionLength > MAX_DISCUSSION_LENGTH) {        
        let shouldComment = true;

        await modifyState(state => {
            state.queuedDeletions = state.queuedDeletions ? state.queuedDeletions : [];
            
            // if it is already queued this thread, don't add it again
            if(state.queuedDeletions.find(queuedDeletion => {
                return queuedDeletion.discussionExpandKey === discussionParentExpandKey;
            })) {
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

        if(shouldComment) {
            await Promise.all([
                commentOnComment(discussionParentExpandKey, "This thread will be deleted in 24 hours.", cookies),
                commentAtRoot(programId, NEW_COMMENT_TEXT, cookies)
            ]);
        }
    }
}

function discussionIsOld(queuedDeletion) {
    let queuedDate = new Date(queuedDeletion.date);
    let queuedDateOffset = new Date(queuedDate.getTime() + TIME_UNTIL_DELETED);
    let now = new Date();
    
    return now > queuedDateOffset;
}

async function checkForAndDeleteOldDiscussions(cookies) {
    // get all discussions queued for deletion
    let queuedDeletions = (await getState()).queuedDeletions || [];
    queuedDeletions.sort((a, b) => a.date.localeCompare(b.date));

    let waitFor = [];

    while(queuedDeletions.length > 0 && discussionIsOld(queuedDeletions[0])) {
        const toDelete = queuedDeletions[0];

        const parentDetails = await getProgramCommentDetails(toDelete.programId, toDelete.discussionExpandKey);
        const commentKey = parentDetails.qaExpandKey;

        waitFor.push(deleteRootComment(cookies, commentKey));

        queuedDeletions.splice(0, 1); // remove it in both places

        waitFor.push(modifyState(state => {
            state.queuedDeletions = state.queuedDeletions || [];

            const queuedDelationIndex = state.queuedDeletions.findIndex(queuedDeletion => {
                return queuedDeletion.discussionExpandKey === toDelete.discussionExpandKey;
            });

            state.queuedDeletions.splice(queuedDelationIndex, 1);
        }));

        console.log("deleted thread");
    }

    await Promise.all(waitFor);
}



module.exports = {
    markDiscussionOld,
    checkForAndDeleteOldDiscussions
};

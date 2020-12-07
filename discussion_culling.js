const {MAX_DISCUSSION_LENGTH, NEW_COMMENT_TEXT, TIME_UNTIL_DELETED} = require("./constants.js");
const {modifyState, getState} = require("./state.js");
const {commentAtRoot, commentOnComment, deleteRootComment} = require("./comments.js");

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
    let now = Date.now();
    
    return now > queuedDate + TIME_UNTIL_DELETED;
}

async function checkForAndDeleteOldDiscussions(cookies) {
    // get all discussions queued for deletion
    let queuedDeletions = (await getState()).queuedDeletions;
    queuedDeletions.sort((a, b) => a.date.localeCompare(b.date));

    let deleting = [];

    while(discussionIsOld(queuedDeletions[0])) {
        const parentDetails = await getProgramCommentDetails(programId, discussionParentExpandKey);
        const commentKey = parentDetails.qaExpandKey;

        deleting.push(deleteRootComment(cookies, commentKey));

        queuedDeletions.splice(0, 1);
    }

    await Promise.all(deleting);
}



module.exports = {
    markDiscussionOld,
    checkForAndDeleteOldDiscussions
};

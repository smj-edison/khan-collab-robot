const {MAX_DISCUSSION_LENGTH, NEW_COMMENT_TEXT} = require("./constants.js");
const {modifyState} = require("./state.js");
const {commentAtRoot, commentOnComment} = require("./comments.js");


async function cullLongDiscussions(cookies, discussionLength, programId, discussionParentExpandKey) {
    if(discussionLength > MAX_DISCUSSION_LENGTH) {
        //const parentDetails = await getProgramCommentDetails(programId, discussionParentExpandKey);
        //const commentKey = parentDetails.qaExpandKey;
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
                discussionExpandKey: discussionParentExpandKey
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

module.exports = {
    cullLongDiscussions
};

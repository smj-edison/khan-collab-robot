const {getCommentsOnComment, commentOnComment} = require("./comments");
const {runCommand} = require("./command_router");
const {getState, modifyState} = require("./state");

async function pollCommandsOnComment(commentId, cookies) {
    const lastComment = (await getState()).lastComment;

    let allComments = await getCommentsOnComment(commentId);

    let lastCommandExecutedIndex = allComments.findIndex(comment => {
        return comment.key === lastComment;
    });

    // delete all commands already executed
    if(lastCommandExecutedIndex !== -1) {
        allComments.splice(0, lastCommandExecutedIndex + 1);
    }

    // get rid of comments by the bot
    allComments = allComments.filter(comment => {
        return comment.authorKaid != process.env.BOT_KAID;
    }); 

    let newLastComment = lastComment;

    for(let i = 0; i < allComments.length; i++) {
        let text = allComments[i].content;
        let kaid = allComments[i].authorKaid;

        newLastComment = allComments[i].key;

        console.log(`Running command ${text} as user ${kaid}`);
        
        runCommand(text, kaid, cookies).then((function(response) {
            commentOnComment(this.commentId, response, cookies);
        }).bind({
            commentId: commentId
        }));
    }
    
    await modifyState(function(state) {
        state.lastComment = newLastComment;
    });
}

module.exports = {
    pollCommandsOnComment
};

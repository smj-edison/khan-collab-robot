const {getCommentsOnComment, commentOnComment} = require("./comments");
const {runCommand} = require("./command_router");

async function pollCommands(commentId, lastComment, cookies) {
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

    for(let i = 0; i < allComments.length; i++) {
        let text = allComments[i].content;
        let kaid = allComments[i].authorKaid;

        lastComment = allComments[i].key;
        
        runCommand(text, kaid).then((function(response) {
            commentOnComment(this.commentId, response, cookies);
        }).bind({
            commentId: commentId
        }));
    }
    
    return lastComment;
}

module.exports = {
    pollCommands
};

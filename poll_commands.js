const {getCommentsOnComment, commentOnComment} = require("./comments");
const {runCommand} = require("./command_router");

async function getLastComment(dbSession) {
    // find the node Poller that points to the node Comment, and return the comment
    const result = await conn.run('MATCH (:Poller)-[:LAST_COMMENT]->(comment:Comment) RETURN comment');

    // if there is a comment
    if(result.records.length > 0) {
        return result.records[0].get(0).properties.comment_id;
    } else {
        // else return no comment
        return "";
    }
}

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

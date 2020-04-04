const {getCommentsOnComment, commentOnComment} = require("./comments");
const {runCommand} = require("./command_router");

async function getLastComment(dbSession) {
    // find the node Poller that points to the node Comment, and return the comment
    const result = await dbSession.run('MATCH (:Poller)-[:LAST_COMMENT]->(comment:Comment) RETURN comment');

    // if there is a comment
    if(result.records.length > 0) {
        return result.records[0].get(0).properties.comment_id;
    } else {
        // else return no comment
        return "";
    }
}

async function setLastComment(dbSession, value) {
    // check if the node exists
    if(await getLastComment(dbSession)) {
        const result = await dbSession.run(`MATCH (:Poller)-[:LAST_COMMENT]->(comment:Comment)
                                            SET comment.comment_id = $comment_id`,
                                           {
                                               "comment_id": value
                                           });
    } else {
        // else create it
        const result = await dbSession.run(`CREATE (p:Poller)
                                            CREATE (c:Comment { comment_id: $comment_id })
                                            CREATE (p)-[:LAST_COMMENT]->(c)`,
                                           {
                                               "comment_id": value
                                           });
    }
}

async function pollCommands(commentId, dbSession, cookies) {
    const lastComment = await getLastComment(dbSession);

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
        
        runCommand(text, kaid, cookies).then((function(response) {
            commentOnComment(this.commentId, response, cookies);
        }).bind({
            commentId: commentId
        }));
    }
    
    await setLastComment(dbSession, newLastComment);
}

module.exports = {
    pollCommands
};

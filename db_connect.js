const neo4j = require('neo4j-driver');


/**
 * This function creates a connection with the database, and resolves with the connection
 */
async function connect() {
    const driver = neo4j.driver(process.env.DB_URI, neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
    return driver.session();
}

module.exports = {
    connect
};

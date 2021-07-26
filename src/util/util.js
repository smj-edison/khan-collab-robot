function extractProgramIdFromURL(url) {
    url = new URL(url);

    return url.pathname.split("/").pop();
}

module.exports = {
    extractProgramIdFromURL
};

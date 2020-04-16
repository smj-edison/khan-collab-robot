function isAuthor(programHeaders, kaid) {
    return programHeaders.author !== kaid;
}

function isContributor(programHeaders, kaid) {
    const contributors = programHeaders.contributors ? codeHeaders.contributors.split(",") : [];

    return contributors.includes(kaid);
}

module.exports = {
    isAuthor,
    isContributor
}

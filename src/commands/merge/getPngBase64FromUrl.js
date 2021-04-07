async function getPngBase64FromUrl(url) {
    return axios.get(branchJSON.imageUrl, {responseType: "arraybuffer"}).then(response => {
        return "data:image/png;base64," + Buffer.from(response.data, "binary").toString("base64");
    });
}

module.exports = getPngBase64FromUrl;

const Diff3 = require("node-diff3");

function calculateMerge(o, a, b) {
    o = o.split("\n");
    a = a.split("\n");
    b = b.split("\n");

    const results = Diff3.merge(a, o, b);

    if(!results.conflict) {
        return {
            conflict: false,
            result: results.result.join("\n")
        };
    }

    // get rid of spacing generated arount merge conflict string
    results.result = results.result.map(val => {
        if(val === "\n<<<<<<<<<\n") return "<<<<<<<<<";
        if(val === "\n=========\n") return "=========";
        if(val === "\n>>>>>>>>>\n") return ">>>>>>>>>";

        return val;
    });

    return {
        conflict: true,
        result: results.result.join("\n")
    };
}

module.exports = calculateMerge;

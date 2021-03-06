const {updateProgram, getProgramJSON} = require("ka-api").programs;
const {getProgramCodeAndHeaders} = require("../metadata/programs");

const {isAuthor} = require("../authorization/authorization.js");

const yargs = require('yargs/yargs');

async function programsettings(cookies, args, kaid) {
    var parsedArgs = yargs(args)
        .number("width").alias("w", "width")
        .number("height").alias("h", "height").argv;

    // make sure the first argument is a program header
    if(isNaN(parsedArgs._[0])) { 
        return "Bad program ID. (is the first argument the program ID?)";
    }

    // make sure they own the program
    const {codeHeaders} = await getProgramCodeAndHeaders(parsedArgs._[0]);

    if(!isAuthor(codeHeaders, kaid)) {
        return "You are not authorized to do this.";
    }
    
    let newSettings = {};

    // change the program settings
    if(parsedArgs.width) {
        newSettings.width = parsedArgs.width;
    }

    if(parsedArgs.height) {
        newSettings.height = parsedArgs.height;
    }

    if(parsedArgs._.length > 1) {
        const programTitle = parsedArgs._.slice(1).join(" ");

        newSettings.title = programTitle;
        newSettings.translatedTitle = programTitle;
    }

    const programJson = await getProgramJSON(parsedArgs._[0]);
    
    await updateProgram(cookies, parsedArgs._[0], programJson.revision.code, newSettings, programJson);

    return `Updated settings.`;
}

module.exports = programsettings;
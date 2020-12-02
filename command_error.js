function CommandError(message) {
    this.message = message;
    this.stack = Error().stack;
}

CommandError.prototype = Object.create(Error.prototype);
CommandError.prototype.name = "CommandError";

module.exports = CommandError;
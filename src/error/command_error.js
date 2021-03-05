function CommandError(message) {
    var error = Error.call(this, message);
  
    this.name = "CommandError";
    this.message = error.message;
    this.stack = error.stack;
}

CommandError.prototype = Object.create(Error.prototype);
CommandError.prototype.constructor = CommandError;

module.exports = {
    CommandError
};

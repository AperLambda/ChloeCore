const EventEmitter = require("events");

const CommandsHolder = module.exports.CommandsHolderClass = require("./commandsholder");

// CommandsHolder is required for Command and CommandsGroup, this is why it is loaded before
const Command = module.exports.CommandClass = require("./command");
const CommandsGroup = module.exports.CommandsGroupClass = require("./commandsgroup");


module.exports.group = function() {
  return new CommandsGroup();
}

class CommandEvents extends EventEmitter {};

module.exports.events = new CommandEvents();

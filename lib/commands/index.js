const parent = module.exports.parent = require("../index");

const EventEmitter = require("events");

// Events manager; has to be initialized first, since it is then used for the other requires
class CommandEvents extends EventEmitter {};

module.exports.events = new CommandEvents();

const CommandsHolder = module.exports.CommandsHolderClass = require("./commandsholder");

// CommandsHolder is required for Command and CommandsGroup, this is why it is loaded before
const Command = module.exports.CommandClass = require("./command");
const CommandsGroup = module.exports.CommandsGroupClass = require("./commandsgroup");
var ArgumentTypes = module.exports.ArgumentTypesClass = require("./argument_types");
const Argument = module.exports.ArgumentClass = require("./argument");

module.exports.group = function()
{
  var commandsgroup = new CommandsGroup();
  parent.client.on("message", context =>
  {
    commandsgroup.trigger(context);
  });
  return commandsgroup;
}

const Command = module.exports.CommandClass = require("./command");
const CommandsGroup = module.exports.CommandsGroupClass = require("./commandsgroup");

module.exports.group = function() {
  return new CommandsGroup();
}

const Command = module.exports.CommandClass = require("./commandclass");
const CommandsGroup = module.exports.CommandsGroupClass = require("./commandsgroupclass");

module.exports.group = function() {
  return new CommandsGroup();
}

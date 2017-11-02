const StatusMessageClass = module.exports.StatusMessageClass = require("./statusmessage");
const checks = require("./checks");

module.exports.status_message = function status_message(content, channel)
{
  return new StatusMessageClass(content, channel);
}

Object.assign(module.exports, checks);

module.exports.help_message = require("./helpmessage");

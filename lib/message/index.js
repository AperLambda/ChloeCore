const StatusMessageClass = module.exports.StatusMessageClass = require("./statusmessage");
const checks = require("./checks");

module.exports.status_message = function status_message(content, channel)
{
  return new StatusMessageClass(content, channel);
}

module.exports.status_message_from = function status_message_from(content, channel, id)
{
  return new StatusMessageClass(content, channel, id);
}

Object.assign(module.exports, checks);

module.exports.help_message = require("./helpmessage");

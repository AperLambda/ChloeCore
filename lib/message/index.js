const StatusMessageClass = module.exports.StatusMessageClass = require("./statusmessage");

module.exports.status_message = function status_message(content, channel)
{
  return new StatusMessageClass(content, channel);
}

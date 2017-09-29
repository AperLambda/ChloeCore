const Discord = require("discord.js");
const parent = require("./index");
const chloecore = require("../index");

function can(channel, perm)
{
  if (chloecore.client)
  {
    return channel.permissionsFor(chloecore.client.user).has(perm);
  }
  else
  {
    throw new Error("Not logged in yet!");
  }
}

module.exports.can_send = channel => can(channel, Discord.Permissions.FLAGS.SEND_MESSAGES);

module.exports.can_send_files = channel => can(channel, Discord.Permissions.FLAGS.ATTACH_FILES);

module.exports.can_manage_messages = channel => can(channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES);

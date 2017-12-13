const Discord = require("discord.js");
const parent = require("./index");
const chloecore = require("../index");
const DMPerms = [
  Discord.Permissions.FLAGS.MANAGE_MESSAGES,
  Discord.Permissions.FLAGS.SEND_MESSAGES,
  Discord.Permissions.FLAGS.ATTACH_FILES
];

function can(channel, perm)
{
  if (chloecore.client)
  {
    if (channel.type == "text") {
      return channel.permissionsFor(chloecore.client.user).has(perm);
    }
    else if (channel.type == "dm" || channel.type == "group"){
      return DMPerms.indexOf(perm) > -1;
    }
  }
  else
  {
    throw new Error("Not logged in yet!");
  }
}

module.exports.can_send = channel => can(channel, Discord.Permissions.FLAGS.SEND_MESSAGES);

module.exports.can_send_files = channel => can(channel, Discord.Permissions.FLAGS.ATTACH_FILES);

module.exports.can_manage_messages = channel => can(channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES);

module.exports.can_manage_message = channel => can(channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES)

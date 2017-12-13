const discord = require("discord.js");

var is_admin = module.exports.is_admin = function(user, guild, channel)
{
  if (guild) {
    var member = guild.member(user);
    if (member) {
      return member.hasPermission(discord.Permissions.FLAGS.ADMINISTRATOR);
    }
  }
  if (channel) {
    if (channel.type === "dm" || channel.type === "group") {
      return true;
    }
  }
  return false;
}

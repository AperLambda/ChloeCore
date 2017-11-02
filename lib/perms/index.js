const discord = require("discord.js");

var is_admin = module.exports.is_admin = function(user, guild)
{
  var member = guild.member(user);
  if (member) {
    return member.hasPermission(discord.Permissions.FLAGS.ADMINISTRATOR);
  }
  return false;
}

module.exports.handler = function(args, context) {
  if (args["keyword"]) {
    let n = args["index"],
      command = commands_handler,
      sub = true,
      command_addr = "";

    while (args[n] && sub) {
      sub = command.find_by_keyword(args[n++]);
      if (sub) {
        command = sub;
        command_addr = command_addr + " " + (sub.keyword || "");
      }
    }

    let embed = {
      title: "Help: \"" + command_addr.trim() + "\"",
      description: command.description,
      fields: []
    };

    embed.fields.push({name: "Usage", value: command.toString()});

    if (command.commands.length > 0) {
      embed.fields.push({name: "Sub commands", value: command.list_commands().replace(/(\w+), /g, "`$1`, ").replace(/ (\w+)$/, " `$1`")});
    }

    if (command.alias && command.alias.length > 0) {
      embed.fields.push({name: "Aliases", value: command.alias.join(", ")});
    }

    if (chloecore.message.can_send(context.channel)) context.channel.send({embed: embed});
  }
  else {
    if (chloecore.message.can_send(context.channel)) {
      context.channel.send({embed: {
        title: "Help: Commands list",
        fields: commands_handler.commands.map(command => {
          return {name: command.keyword, value: command.description};
        })
      }});
    }
  }
}

module.exports.description = "Displays a help message";

module.exports.args = ["[<keyword>]"];

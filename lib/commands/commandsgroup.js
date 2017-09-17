const parent = require("./index");
const path = require("path");
const fs = require("fs");

class CommandsGroup extends parent.CommandsHolderClass
{
  constructor()
  {
    super();
    this.prefix = "";
    this.middleware = (command, args, context) => true;
    this.commands_directory = "";
    return this;
  }

  set_prefix(prefix)
  {
    this.prefix = prefix;
    return this;
  }

  set_middleware(middleware)
  {
    this.middleware = middleware;
    return this;
  }

  trigger(context)
  {
    if (context && this.commands)
    {
      var args = split_args(context.content.replace(this.prefix, ""));
      this.commands.forEach(command =>
        {
        if (context.content.startsWith(this.prefix + command.keyword))
        {
          if (this.middleware(command, args, context))
          {
            command.trigger(args, context);
          }
        }
      });
    }
  }

  set_commands_directory(directory)
  {
    this.commands_directory = directory;
  }

  load_commands(_directory, parent)
  {
    let directory = _directory || this.commands_directory || "./";
    fs.readdir(directory, (err, commands) =>
    {
      if (commands)
      {
        commands.reverse().forEach(command =>
        {
          let command_addr = path.join(directory, command);
          let keyword = command.replace(/\..*$/, "");
          if (fs.lstatSync(command_addr).isDirectory())
          {
            let new_parent = this.find_by_keyword(keyword);
            if (!new_parent)
            {
              new_parent = this.make_empty(keyword);
              console.log("Created empty command " + new_parent.keyword);
            }
            this.load_commands(command_addr, new_parent);
            console.log("> (" + command + ")");
          }
          else if (command.endsWith(".js"))
          {
            if (parent)
            {
              parent.make(keyword, require(command_addr));
              console.log("Loaded " + keyword + " (" + (parent.keyword || "") + ")");
            }
            else
            {
              this.make(keyword, require(command_addr));
              console.log("Loaded " + keyword);
            }
          }
        });
      }
      else {
        console.log("No commands in " + directory);
      }
    });
  }
}

module.exports = CommandsGroup;

function split_args(string)
{
  return [].concat
    .apply([], string.split('"')
    .map(function(v,i)
    {
      return i%2 ?
        v :
        v.split(' ');
    }))
    .filter(Boolean);
}

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
      let args = split_args(context.content.toLowerCase().replace(this.prefix, ""));
      this.commands.forEach(command =>
        {
        if (context.content.startsWith(this.prefix) && args[0] == command.keyword)
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
    this.commands_directory = path.resolve(process.cwd(), directory);
    return this;
  }

  load_commands(_directory, parent_command)
  {
    return new Promise((resolve, reject) =>
    {
      let directory = _directory || this.commands_directory || "./";
      fs.readdir(directory, (err, commands) =>
      {
        if (commands)
        {
          let promises = [];
          commands.reverse().forEach(command =>
          {
            this._load_command(directory, command, parent_command, promises);
          });

          Promise.all(promises).then(values =>
          {
            parent.events.emit("directoryLoaded", directory);
            resolve(
              {
                name: "directoryLoaded",
                directory: directory,
                values: values
              });
          })
          .catch(error =>
          {
            parent.events.emit(error.name, error.directory);
          });
        }
        else {
          if (!parent_command)
          {
            parent.events.emit("directoryEmpty", directory);
          }
          reject({name: "directoryEmpty", directory: directory});
        }
      });
    });
  }

  _load_command(directory, command, parent_command, promises = [])
  {
    let command_addr = path.join(directory, command);
    let keyword = command.replace(/\..*$/, "");
    if (fs.lstatSync(command_addr).isDirectory())
    {
      let new_parent = this.find_by_keyword(keyword);
      if (!new_parent)
      {
        new_parent = this.make_empty(keyword);
      }
      promises.push(this.load_commands(command_addr, new_parent));
    }
    else if (command.endsWith(".js") || command.endsWith(".json"))
    {
      let new_command;

      delete require.cache[require.resolve(command_addr)];
      if (parent_command)
      {
        new_command = parent_command.make(keyword, require(command_addr));
      }
      else
      {
        new_command = this.make(keyword, require(command_addr));
      }
      
      promises.push(Promise.resolve(
      {
        name: "commandLoaded",
        directory: directory,
        command: new_command
      }));
    }
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

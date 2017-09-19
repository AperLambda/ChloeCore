const parent = require("./index");

class CommandsHolder
{
  constructor()
  {
    this.commands = [];
    return this;
  }

  find_by_keyword(keyword)
  {
    let result;
    this.commands.forEach(command =>
    {
      if (command.keyword == keyword)
      {
        result = command;
      }
    });
    if (result) return result;
  }

  make(keyword, handler)
  {
    let act_command = this.find_by_keyword(keyword);
    if (!act_command)
    {
      act_command = this.commands[this.commands.push(new parent.CommandClass(keyword, handler)) - 1];
      parent.events.emit("commandCreated", act_command, this);
    }
    else
    {
      act_command.handler = handler;
      act_command.empty = false;
      parent.events.emit("commandUpdated", act_command, this);
    }
    return act_command;
  }

  make_empty(keyword)
  {
    let act_command = this.find_by_keyword(keyword);
    if (!act_command)
    {
      act_command = this.commands[this.commands.push(new parent.CommandClass(keyword)) - 1];
      parent.events.emit("commandCreated", act_command, this);
    }
    return act_command;
  }
}

module.exports = CommandsHolder

const parent = require("./index");

class Command extends parent.CommandsHolderClass
{
  constructor(keyword, handler)
  {
    super();
    this.keyword = keyword;
    this.description = "No description given";
    if (typeof handler === "function")
    {
      this.handler = handler;
    }
    else if (typeof handler === "object")
    {
      if (handler.handler)
      {
        this.handler = handler.handler;
        if (handler.description) this.description = handler.description;
      }
      else
      {
        throw new Error("Invalid command object!");
      }
    }
    this.empty = typeof handler != "undefined";
    return this;
  }

  set_description(description)
  {
    this.description = description;
    return this;
  }

  trigger(args, context, index = 1)
  {
    let ran_command = false;
    if (Array.isArray(this.commands))
    {
      this.commands.forEach(command =>
      {
        if (args[index] == command.keyword && !ran_command)
        {
          command.trigger(args, context, index + 1);
          ran_command = true;
        }
      });
    }

    if (!ran_command && this.handler)
    {
      this.handler(args, context);
      parent.events.emit("commandTriggered", this);
    }
  }
}

module.exports = Command;

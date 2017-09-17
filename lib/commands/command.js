const parent = require("./index");

class Command extends parent.CommandsHolderClass
{
  constructor(keyword, handler)
  {
    super();
    this.keyword = keyword;
    this.handler = handler;
    this.description = "No description given";
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
    }
  }
}

module.exports = Command;

const parent = require("./index");

class Command extends parent.CommandsHolderClass
{
  constructor(keyword, handler, description, strict, args)
  {
    super();
    this.keyword = keyword;
    this.description = description || "No description given";
    this.strict = strict || false;
    this.args = args || [];
    if (typeof handler === "function")
    {
      this.handler = handler;
    }
    else if (typeof handler === "object")
    {
      if (handler.handler) this.handler = handler.handler;
      if (handler.description) this.description = handler.description;
      if (handler.strict) this.strict = handler.strict;
      if (Array.isArray(handler.args))
      {
        this.args = [];
        handler.args.forEach(arg =>
        {
          let new_arg = new parent.ArgumentClass(arg);
          if (new_arg)
          {
            this.args.push(new_arg);
          }
          else
          {
            parent.events.emit("invalidArgument");
          }
        });
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

    if (!ran_command)
    {
      let valid = true;
      if (this.args.length > 0)
      {
        this.args.forEach((arg, i) =>
          {
            valid = valid && (arg.is_valid(args[index + i]));
            if (valid)
            {
              args[arg.name] = args[index + i];
            }
          });
      }
      args["index"] = index;
      if (valid || !this.strict)
      {
        if (this.handler)
        {
          this.handler(args, context);
        }
        parent.events.emit("commandTriggered", this, args);
      }
      else
      {
        parent.events.emit("invalidCommand", this, args, context);
      }
    }
  }
}

module.exports = Command;

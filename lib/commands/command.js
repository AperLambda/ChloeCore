const parent = require("./index");

class Command extends parent.CommandsHolderClass
{
  constructor(keyword, handler, description, strict, args)
  {
    super();
    this.keyword = keyword;
    this.description = description || "No description given";
    this.strict = strict || true;
    this.args = args || [];
    this.middleware = (args, context) => { return true; };
    this.alias = [];
    if (typeof handler === "function")
    {
      this.handler = handler;
    }
    else if (typeof handler === "object")
    {
      if (handler.handler) this.handler = handler.handler;
      if (handler.desc || handler.description) this.description = handler.desc || handler.description;
      if (handler.strict || handler.strict_mode) this.strict = handler.strict || handler.strict_mode;
      if (handler.alias || handler.aliases) this.alias = handler.alias || handler.aliases;
      if (Array.isArray(handler.args || handler.arguments))
      {
        this.args = [];
        (handler.args || handler.arguments).forEach(arg =>
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
    if (this.middleware(args, context))
    {
      let ran_command = false;
      if (Array.isArray(this.commands))
      {
        this.commands.forEach(command =>
        {
          if ((args[index] == command.keyword || command.alias.indexOf(args[index]) != -1) && !ran_command)
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
    else
    {
      parent.events.emit("middlewareFail", this, args, context);
    }
  }

  toString()
  {
    let result = this.keyword;
    this.args.forEach(arg => {
      result += " " + arg.toString();
    });
    return result;
  }
}

module.exports = Command;

const Command = module.parent.Command;

class CommandsGroup
{
  constructor()
  {
    this.prefix = "";
    this.middleware = (command, args, context) => true;
    this.commands = [];
    this.trigger = this.prototype.trigger.apply(this, [context]);
  }

  prefix(prefix)
  {
    this.prefix = prefix;
    return this;
  }

  middleware(middleware)
  {
    this.middleware = middleware;
    return this;
  }

  make(keyword, handler)
  {
    return commands[commands.push(new CommandClass(keyword, handler)) - 1];
  }
}

module.exports = CommandsGroup;

'use strict';

const Command = module.parent.Command;

class CommandsGroup
{
  constructor()
  {
    this.prefix = "";
    this.middleware = (command, args, context) => true;
    this.commands = [];
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

  make(keyword, handler)
  {
    return this.commands[this.commands.push(new Command(keyword, handler)) - 1];
  }

  trigger(context)
  {
    var args = split_args(context.content);
    this.commands.forEach(command =>
      {
      if (context.content.startsWith(this.prefix + command.keyword))
      {
        if (this.middleware(command, args, context))
        {
          command.handler(args, context);
        }
      }
    })
  }
}

module.exports = CommandsGroup;

function split_args(string)
{
  return [].concat
    .apply([], str.split('"')
    .map(function(v,i)
    {
      return i%2 ?
        v :
        v.split(' ');
    }))
    .filter(Boolean);
}

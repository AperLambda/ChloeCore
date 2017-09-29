const parent = require("./index");

var types = [];

class ArgumentType
{
  constructor(name, middleware, parent)
  {
    this.name = name;
    if (this.parent = parent)
    {
      this.middleware = parent.middleware;
    }
    else
    {
      this.middleware = middleware;
    }

    return this;
  }

  static register_type(name, middleware)
  {
    let new_type = types[types.push(new ArgumentType(name, middleware)) - 1];
    parent.events.emit("LoadedArgumentType", {argumentType: new_type, name, middleware});
    return new_type;
  }

  static check_type(name, content, rangeMin, rangeMax)
  {
    let type = types.filter(type => {return type.name == name;});

    if (type[0] && type[0].middleware)
    {
      return type[0].middleware(content, rangeMin, rangeMax);
    }

    return true;
  }
}

var register_type = module.exports.register_type = ArgumentType.register_type;

register_type("number", (string, rangeMin, rangeMax) => {
  if (!+string) return false;
  if (rangeMax)
  {
    if (!(+string >= rangeMin) || !(+string <= rangeMax)) return false;
  }
  else if (rangeMin)
  {
    if (!(+string > rangeMin)) return false;
  }
  return true;
});

register_type("user", (string, rangeMin, rangeMax) => {
  return Boolean(string.match(/^\<@\!?\d{18}\>$/));
});

register_type("string", (string, rangeMin, rangeMax) => {
  if (rangeMax)
  {
    if (!(string.length >= rangeMin) || !(string.length <= rangeMax)) return false;
  }
  else if (rangeMin)
  {
    if (!(string.length >= rangeMin)) return false;
  }
  return true;
});

module.exports = ArgumentType;

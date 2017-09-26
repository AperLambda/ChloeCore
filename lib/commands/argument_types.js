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
    return types[types.push(new ArgumentType(name, middleware)) - 1];
  }

  static check_type(name, content, rangeMin, rangeMax)
  {
    let type = types.filter(type => {return type.name == name;});
    console.log(type);

    if (type[0] && type[0].middleware)
    {
      console.log("...");
      return type[0].middleware(content, rangeMin, rangeMax);
    }
    return true;
  }
}

function register_type(name, middleware)
{
  return types[types.push(new ArgumentType(name, middleware))];
}

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

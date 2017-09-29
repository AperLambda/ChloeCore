const parent = require("./index");

class Argument {
  constructor(argument)
  {
    this.name = "";
    this.type = "";
    this.range = [0];
    this.required = true;

    if (typeof argument == "object")
    {
      this.name = argument.name || this.name;
      this.type = argument.type || this.type;
      this.range = argument.range || this.range;
      this.required = argument.required || this.required;
    }
    else if (typeof argument == "string")
    {
      let parsed = /^(?:<|(?:\[<?))(([\w_-]+)(?:\:([\w_-]+))?(?:[ \.](\d+)?(?:(?:\.\.|[\-=]>)(\d+))?)?)?(?:>|(?:>?\]))$/.exec(argument); // PARSING IT
      if (parsed !== null)
      {
        this.required = !(argument.startsWith("[") && argument.endsWith("]"));
        this.name = parsed[2] || this.name;
        this.type = parsed[3] || this.type;
        if (+parsed[4])
        {
          if (+parsed[5])
          {
            this.range = [+parsed[4], +parsed[5]];
          }
          else
          {
            this.range = [+parsed[4]];
          }
        }
        return this;
      }
      return false;
    }
    else if (argument instanceof Argument)
    {
      return argument;
    }

    if (!Array.isArray(this.range))
    {
      this.range = [+this.range];
    }

    return this;
  }

  is_valid(string)
  {
    if (typeof string == "string")
    {
      return parent.ArgumentTypesClass.check_type(this.type, string, this.range[0], this.range[1]);
    }
    else
    {
      if (typeof string == "undefined")
      {
        return !this.required;
      }
      return false;
    }
  }

  toString()
  {
    let result = "";
    if (!this.required) result += "[";
    result += "<" + this.name;
    if (this.type != "") result += ":" + this.type;
    if (this.range)
    {
      if (this.range[0] != 0) result += " " + this.range[0];
      if (this.range.length > 1) result += ".." + this.range[1];
    }
    result += ">";
    if (!this.required) result += "]";
    return result;
  }
}

module.exports = Argument;

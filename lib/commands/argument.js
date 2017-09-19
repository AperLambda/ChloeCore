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
      let parsed = /^<|(?:\[<?)([\w_\:]+)>|(?:>?\])$/.exec(argument); // First parsing: is valid argument
      if (parsed !== null)
      {
        if (argument.startsWith("[]") && argument.endsWith("]")) this.required = false; // this.required
        parsed = /^([\w_-]+)(?:\:([\w_-]+)(?: |\.(\d+)?(?:..(\d+)?)?)?)?$/.exec(parsed[1]); // Second parsing: argument name, type and range
        if (parsed != null)
        {
          this.name = parsed[1] || this.name;
          this.type = parsed[2] || this.type;
          if (+parsed[3])
          {
            if (+parsed[4])
            {
              this.range = [+parsed[3], +parsed[4]];
            }
            else
            {
              this.range = [+parsed[3]];
            }
          }
          if (this.name && this.type)
            return this;
        }
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
      switch (this.type)
      {
        case "number":
          if (!+string) return false;
          if (this.range.length > 1)
          {
            if (!(+string >= this.range[0]) || !(+string <= this.range[1])) return false;
          }
          else if (this.range[0] != 0)
          {
            if (!(+string > this.range[0])) return false;
          }
          break;

        case "user":
          if (!string.match(/^\<@\!?\d{18}\>$/)) return false;
          break;

        case "string":
          if (this.range.length > 1)
          {
            if (!(string.length >= this.range[0]) || !(string.length <= this.range[1])) return false;
          }
          else if (this.range[0] != 0)
          {
            if (!(string.length >= this.range[0])) return false;
          }
          break;

        default:
          break;
      }
      return true;
    }
    else
    {
      if (typeof string == "undefined")
      {
        return this.required;
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

class StatusMessage
{
  constructor(content, channel)
  {
    this.content = content;
    this.channel = channel;
    this.message = undefined;
    this.matches = [];
    this.promise = undefined;
  }

  set(match, value)
  {
    if (typeof match == "string")
    {
      let parsed_match = match.replace("{{", "").replace("}}", "");
      this.matches[parsed_match] = value;
    }
    return this;
  }

  get()
  {
    let parsed;
    if (typeof this.content == "string")
    {
      parsed = this.content;
      Object.keys(this.matches).forEach(match =>
      {
        let value = this.matches[match];
        parsed = parsed.replace("{{" + match + "}}", value);
      });
    }
    else if (typeof this.content == "object")
    {
      parsed = {};
      function iter(elem, target) {
        //console.log(parsed);
        Object.keys(elem).forEach(sub =>
        {
          if (typeof elem[sub] == "string")
          {
            target[sub] = elem[sub];
            Object.keys(this.matches).forEach(match =>
            {
              if (elem[sub].indexOf(match) > -1) {
                let value = this.matches[match];
                target[sub] = elem[sub].replace("{{" + match + "}}", value);
              }
            });
          }
          else if (typeof elem[sub] == "object")
          {
            if (Array.isArray(elem[sub])) target[sub] = [];
            else target[sub] = {};
            iter.call(this, elem[sub], target[sub]);
          }
        });
      }
      iter.call(this, this.content, parsed);
    }
    return parsed;
  }

  update()
  {
    return new Promise((resolve, reject) =>
    {
      if (this.message)
      {
        this.message.edit(this.get())
        .then(message =>
        {
          resolve(this);
        })
        .catch(reject);
      }
      else
      {
        this.channel.send(this.get())
        .then(message =>
        {
          this.message = message;
          resolve(this);
        })
        .catch(reject);
      }
    });
  }
}

module.exports = StatusMessage;

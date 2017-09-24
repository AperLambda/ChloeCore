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
    let parsed = this.content;

    Object.keys(this.matches).forEach(match =>
    {
      let value = this.matches[match];
      parsed = parsed.replace("{{" + match + "}}", value);
    });

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

const parent = require("./index");

class StatusMessage
{
  constructor(content, channel, id)
  {
    if (id) {
      return new Promise((resolve, reject) => {
        this.content = content;
        this.channel = channel;
        this.message = undefined;
        this.matches = [];
        this.promise = undefined;
        channel.fetchMessage(id).then(msg => {
          this.message = msg;
          resolve(this);
        }).catch(reject);
      });
    }
    else {
      this.content = content;
      this.channel = channel;
      this.message = undefined;
      this.matches = [];
      this.promise = undefined;
      return this;
    }
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
        this.message.edit(this.get().content || "", this.get())
        .then(message =>
        {
          resolve(this);
        })
        .catch(reject);
      }
      else
      {
        if (parent.can_send(this.channel))
        {
          this.channel.send(this.get().content || "", this.get())
          .then(message =>
          {
            this.message = message;
            resolve(this);
          })
          .catch(reject);
        }
        else
        {
          reject("Insufficient permissions");
        }
      }
    });
  }

  pin() {
    return new Promise((resolve, reject) => {
      if (this.message && parent.can_manage_message(this.channel)) {
        this.message.pin().then(_ => {
          resolve(this);
        }).catch(reject);
      }
      else {
        reject(this);
      }
    });
  }

  get_id() {
    return (this.message || {id: null}).id;
  }
}

module.exports = StatusMessage;

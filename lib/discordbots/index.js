const rp = require("request-promise");
const events = require("events");

const default_settings = {
  interval: 5*60*1000
}


class DiscordBots extends events.EventEmitter
{
  constructor()
  {
    super();
  }

  init(settings)
  {
    this.settings = Object.assign(settings, default_settings);
    if (this.interval)
    {
      clearInterval(this.interval);
    }

    if (Array.isArray(this.settings.websites))
    {
      this.settings.websites.forEach(website =>
      {
        let parsed;
        if (parsed = /^(?:(?:https?:)?\/\/)?([\w\.\-_]+)\/?$/.exec(website.url)) // If the given url does not have a `path`
        {
          website.url = "https://" + parsed[1] + "/api";
        }
      });
    }

    if (this.settings.interval > 0)
    {
      this.interval = setInterval(this.update.bind(this), this.settings.interval);
      this.update();
    }

  }

  update()
  {
    if (Array.isArray(this.settings.websites) && (client || this.client) && (client || this.client).user)
    {
      this.settings.websites.forEach((website, id) =>
      {
        this.postStats(website).then(_ =>
          {
            this.emit("success", _);
          })
          .catch(_ =>
          {
            this.emit("error", _);
          })
      });
    }
  }

  getBots(website)
  {
    return this.request(website,
    {
      method: "GET",
      url: "/bots"
    })
  }

  getInfo(website)
  {
    return this.request(website,
    {
      method: "GET",
      url: "/bots/:id"
    })
  }

  getStats(website)
  {
    return this.request(website,
    {
      method: "GET",
      url: "/bots/:id/stats"
    });
  }

  postStats(website)
  {
    return this.request(website,
    {
      method: "POST",
      url: "/bots/:id/stats"
    })
  }

  request(website, settings)
  {
    return new Promise((resolve, reject) =>
    {
      let url = (website.url || (module.exports.settings.websites[website] || {}).url || website).replace(/\/$/, "");
      let botID = website.id || (module.exports.settings.websites[website] || {}).id || (module.exports.settings.client || client).user.id;
      let sc = website.server_count || (module.exports.settings.websites[website] || {}).server_count || Array.from((module.exports.settings.client || client).guilds).length;
      let token = website.token || (module.exports.settings.websites[website] || {}).url;
      let options =
      {
        method: settings.method,
        uri: url + settings.url.replace(/:id|:bot_user_id/g, botID),
        body: {
            "server_count": sc
        },
        headers: {
            'Authorization': token
        },
        json: true
      };

      rp(options).then(output =>
      {
        if (output)
        {
          if (typeof output == "object")
          {
            resolve(output);
          }
          else if (typeof output == "string")
          {
            resolve(JSON.parse(output));
          }
        }
        else
        {
          reject({
            "error": "No answer"
          });
        }
      }).catch(reject);
    });
  }
};

module.exports = new DiscordBots();

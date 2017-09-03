class Command
{
  constructor(keyword, handler)
  {
    this.keyword = keyword;
    this.handler = handler;
    this.description = "No description given";
    return this;
  }

  set_description(description) {
    this.description = description;
    return this;
  }
}

module.exports = Command;

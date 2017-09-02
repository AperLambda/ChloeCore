const fs = require('fs');
const mkdirp = require('mkdirp');
const HashMap = require('hashmap');
const filesystem = require('lambdacommonjs').filesystem;

const langs = new HashMap();
const langFilesNotFound = "Please put lang files in './system/lang/'!";

exports.init = function (path)
{
  if (!fs.existsSync(path + 'system/lang/'))
  {
    mkdirp(path + 'system/lang/', (err) => { if (err) throw err });
    console.error(langFilesNotFound);
    process.exit(404);
  }
  const files = fs.readdirSync(path + 'system/lang/');
  if (files.length === 0)
  {
    console.error(langFilesNotFound);
    process.exit(404);
  }
  for (i = 0; i < files.length; i++)
  {
    const file = files[i];
    try
    {
      const data = fs.readFileSync(path + 'system/lang/' + file);
      langs.set(file.replace('.json', '').toLowerCase(), JSON.parse(data.toString()))
    }
    catch (error)
    {
      if (file === 'en_US.json')
        throw new Error('CRLF_EN_US: Cannot read lang file "en_US.json"! {Parent_error: "' + error + "'}");
      else
        console.warn('CRLF: Cannot read lang file "' + file + "'!")
    }
  }
};

exports.hasLang = function (lang)
{
  return langs.has(lang.toLowerCase());
};

exports.getLang = function (lang)
{
  return langs.get(lang.toLowerCase());
};

exports.getLangWithoutUndefined = function (lang)
{
  if (!this.hasLang(lang))
  {
    if (lang === 'en_US')
      throw new Error('CFLF_EN_US: Cannot find lang file "en_US"!', 404);
    return this.getLang('en_US');
  }
  return this.getLang(lang);
};
exports.version = require('../package.json').version;
exports.lang = require('./chloelang');

const colors = require('colors');
const lambdacommon = require('lambdacommonjs');

var init;

exports.init = function ()
{
  if (init)
  {
    throw new Error('ChloeCore is already initialized!');
  }
  console.log('Starting ' + 'ChloeCore'.cyan + (' v' + this.version + '...').reset);
  console.log('   ____ _     _             ____               \n'.cyan +
              '  / ___| |__ | | ___   ___ / ___|___  _ __ ___ \n'.cyan +
              ' | |   | \'_ \\| |/ _ \\ / _ \\ |   / _ \\| \'__/ _ \\\n'.cyan +
              ' | |___| | | | | (_) |  __/ |__| (_) | | |  __/\n'.cyan +
              '  \\____|_| |_|_|\\___/ \\___|\\____\\___/|_|  \\___|\n'.cyan +
              '                                               ');
  // console.log(colors.gray('█████████████████████████████████████'));
  // console.log('█'.gray + '███'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + colors.gray('███') + '███'.cyan + colors.gray('█') + '███'.cyan + colors.gray('█') + colors.cyan('███') + colors.gray('█') + '███'.cyan + '█'.gray + '██'.cyan + '██'.gray + '███'.cyan + '█'.gray);
  // console.log('█'.gray + '█'.cyan + '███'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + colors.gray('███') + '█'.cyan + colors.gray('█') + colors.cyan('█') + colors.gray('█') + colors.cyan('█') + colors.gray('███') + colors.cyan('█') + colors.gray('███') + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '███'.gray);
  // console.log('█'.gray + '█'.cyan + '███'.gray + '███'.cyan + '█'.gray + '█'.cyan + '███'.gray + '█'.cyan + colors.gray('█') + colors.cyan('█') + colors.gray('█') + colors.cyan('██') + colors.gray('██') + colors.cyan('█') + colors.gray('███') + colors.cyan('█') + colors.gray('█') + colors.cyan('█') + '█'.gray + '██'.cyan + '██'.gray + '██'.cyan + '██'.gray);
  // console.log('█'.gray + '█'.cyan + '███'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + colors.gray('███') + '█'.cyan + colors.gray('█') + colors.cyan('█') + colors.gray('█') + colors.cyan('█') + colors.gray('███') + colors.cyan('█') + colors.gray('███') + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '███'.gray);
  // console.log('█'.gray + '███'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '███'.cyan + colors.gray('█') + '███'.cyan + colors.gray('█') + colors.cyan('███') + colors.gray('█') + colors.cyan('███') + colors.gray('█') + '███'.cyan + '█'.gray + '█'.cyan + '█'.gray + '█'.cyan + '█'.gray + '███'.cyan + '█'.gray);
  // console.log(colors.gray('█████████████████████████████████████'));
  console.log('Using' + ' discord.js'.rainbow + ' and ' + ('λcommon.js v' + lambdacommon.version).cyan);

};

this.init();
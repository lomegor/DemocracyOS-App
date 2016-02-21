var argv = require('yargs').argv;
var production = 'production' === process.env.NODE_ENV || argv.production;
var p = require('path');

var settings = {};
settings.public = p.normalize('./public');
settings.clientEntryPoint = p.normalize('./lib/boot/boot.js');
settings.stylEntryPoint = p.normalize('./lib/boot/boot.styl');
settings.verbose = !!argv.verbose;
settings.sourcemaps = !production && argv.sourcemaps;
settings.minify = !production && argv.minify;
settings.production = production;
settings.livereload = !production && argv.livereload;

module.exports = settings;

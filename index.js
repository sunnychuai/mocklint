var colors = require('colors');
var JSON5 = require('json5');
var glob = require('glob');
var path = require('path');
var fs = require('fs');

var isError; 
function start() {
    var cwd = path.resolve(__dirname, '../../');
    process.argv.slice(2).forEach(function(pattern) {
        glob.sync(pattern, {
            cwd: cwd,
            ignore: ['node_modules/**/*', 'build/**/*', 'build.js']
        }).forEach(function (filename) {
            var content = fs.readFileSync(path.join(cwd, filename), 'utf-8');
            try {
                filename.endsWith('.json') ? JSON5.parse(content) : require(path.join(cwd, filename));
            } catch (err) {
                handleError(filename, err);
            }
        });
    });
    isError && process.exit(1);
}

function handleError(filename, err) {
    console.error(colors.yellow.underline(filename) + '\n' + colors.red(err.message) + '\n');
    isError = true;
}

start();
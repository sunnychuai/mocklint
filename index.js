var Command = require('commander').Command;
var colors = require('colors');
var package = require('./package.json');
var JSON5 = require('json5');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
    
function start() {
    var program = new Command('mocklint');
    program.version(package.version)
        .description(package.description)
        .usage('mocklint <file ...>')
        .parse(process.argv);

    if(!(program.args.length)) {
        return program.help();
    }

    var cwd = path.resolve(__dirname, '../../');

    program.args.forEach(function(pattern) {
        glob.sync(pattern, {
            cwd: cwd,
            ignore: ['node_modules/**/*', 'build/**/*']
        }).forEach(function (filename) {
            var content = fs.readFileSync(path.join(cwd, filename), 'utf-8');
            if(filename.endsWith('.json')){
                try {
                    JSON5.parse(content);
                } catch (err) {
                    handleError(filename, err);
                }
                return;
            }

            try {
                require(path.join(cwd, filename));
            } catch (err) {
                try {
                    eval('(' + content + ')');
                } catch (err) {
                    handleError(filename, err);
                }
            }
        });
    });
}

function handleError(filename, err) {
    console.error(colors.yellow.underline(filename) + '\n' + colors.red(err.message) + '\n');
}

start();
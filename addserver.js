var fs = require('fs');

var configPath = process.env.HOME + '/.localserver/config.js';
var config = fs.readFileSync(configPath).toString();
var pathMapping = JSON.parse(config);  
var mappings = process.argv.slice(2);
if (mappings.length > 0) {
    var context = mappings[0];
    var path = mappings[1];
    if (config[context]) {
        console.warn('current context is repeat' + config[context]);
    }
    console.log(context, path || process.cwd())
    pathMapping[context] = path || process.cwd();
}
fs.writeFile(configPath, JSON.stringify(pathMapping), function (err) {
    if (err) throw err;
    console.log('Config  saved!');
});

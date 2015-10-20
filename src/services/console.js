var config = require('../../config');
config = config.services.console;
function log(value){
    if(config.humanReadable)
    {
        console.log('Current temperature is ' + value.F);
    } else {
        console.log(value);
    }
}

exports.log = log;
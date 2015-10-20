var config = require('../config');
var services = [];
var init = function(){
    var keys = Object.keys(config.services);
    for(index in keys){
        var key = keys[index];
        console.log('Registering service: '+ key);
        services[key] = require('./services/'+ key).log;
    }
};

var log = function(message){
    var serviceList = Object.keys(services);
    for(index in services){
        services[index](message);
    }
}
init();
exports.init = init;
exports.log  = log;
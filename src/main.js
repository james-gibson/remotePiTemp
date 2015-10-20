var ds18b20 = require('ds18b20');
var crontab = require('node-crontab');
var config =  require('../config.json');
var logger =  require('./logger.js');

function recordTemperature(){
    ds18b20.sensors(function(err, ids) {
        for(index in ids){
            ds18b20.temperature(ids[index], function(err, value) {
                logger.log(value);
            });
        }
    });
}

var jobId = crontab.scheduleJob(config.schedule, recordTemperature);
console.log('CronJob scheduled: '+ jobId);
recordTemperature();
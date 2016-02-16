var ds18b20 = require('ds18b20');
var crontab = require('node-crontab');
var config =  require('../config.json');
var logger =  require('./logger.js');

var sensors = [];

function recordTemperature() {
    sensors.forEach(function (sensor) {
        ds18b20.temperature(sensor, function(err, value) {
                logger.log(value);
            });
    });
};

function setupSensors() {
    var promise = new Promise(function (resolve, reject) {
        var tmpSensors;
        var response;

        tmpSensors = [];
        ds18b20.sensors(function(err, ids) {
            for(index in ids){
                tmpSensors.push(ids[index]);
                console.log(ids[index]);
            }
            console.log('Are all sensors accounted for? [y/n] ');
            prompt.start();
            prompt.get(['inputResponse'], function (err, result) {
                if (result.inputResponse.toLowerCase() == 'y') {
                    resolve(tmpSensors);
                } else {
                    reject('Please reconnect sensors and retry.');
                }
            });
        });
    });

    return promise;
};

var jobId = crontab.scheduleJob(config.schedule, recordTemperature);
console.log('CronJob scheduled: '+ jobId);
recordTemperature();
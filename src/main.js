var ds18b20 = require('ds18b20');
var crontab = require('node-crontab');
var config =  require('../config.json');
var logger =  require('./logger.js');
var prompt = require('prompt');

var sensors = [];

function recordTemperature() {
    sensors.forEach(function (sensor) {
        ds18b20.temperature(sensor, function(err, value) {
            if (config.sensors[value.id]) {
                value.alias = config.sensors[value.id].alias;
            }


            if (config.triggers.acceptableRange) {
                if (value.F < config.triggers.acceptableRange.low
                    || value.F > config.triggers.acceptableRange.high) {
                    logger.log(value);
                }
            } else {
                logger.log(value);
            }
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

function run(allSensors) {
    sensors = allSensors;

    var jobId = crontab.scheduleJob(config.schedule, recordTemperature);
    console.log('CronJob scheduled: '+ jobId);

    recordTemperature();
};

setupSensors()
    .then(function (allSensors) {
        run(allSensors);
    })
    .catch(function (err) {
        console.log(err);
    })
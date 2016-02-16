var Twitter = require('twitter');
var config = require('../../config');

config = config.services.twitter;

var client;

function log(value) {
    var status;
    client = new Twitter({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
        access_token_key: config.accessTokenKey,
        access_token_secret: config.accessTokenSecret
    });

    if(config.humanReadable) {
        status = 'Current temperature for ' + (value.alias || value.id) + ' is ' + value.F + '°.';
    } else {
        status = value;
    }

    client.post('statuses/update', {status: status}, function(error, tweet, response){
        if(error && error[0].code != 187) {
            console.log(error);
            throw error;
        }
    });
};

exports.log = log;
var Analytics = require('analytics-node');
var config = require('../../config');
var ds18b20 = require('ds18b20');
var analytics = new Analytics(config.services.segment.key);
function init(){
    analytics.identify({
        userId: config.nodeId,
        traits: {
            device:"pi",
            location:config.location
        }
    });

    ds18b20.sensors(function(err, ids) {
        for(index in ids){
            var location,
                id;
            var sensorConfig =config.sensors[ids[index]];
            if(sensorConfig)
            {
                location = sensorConfig.location;
                id = sensorConfig.id;
            } else {
                id = ids[index];
                location = "Unknown";
            }

            analytics.identify({
                userId: id,
                traits: {
                    device:'ds18b20',
                    parent:config.nodeId,
                    location:location
                }
            });
        }
    });

}
function log(event){
    var result = {};
    if(typeof event === "string")
    {
        var message = event;
        result.event = message;
        result.userId = config.nodeId;

    } else {
        result.userId = event.id;
        result.properties = event;

        result.event = "Temperature Record";
    }
    analytics.track(result);
}
init();
exports.log = log;
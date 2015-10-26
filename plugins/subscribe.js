var util = require('./../util');
var redis = require("redis"),
client = redis.createClient();


var image = function() {

    this.init = function() {
        console.log('[Plugin] subscribe loaded');
        client.select(3, function() { });

        client.on("error", function(err) {
            console.log("[redis] Error " + err);
        });
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["subscribe"]);
        if (args) {
            if (args.length > 1) {
                var area = args[1].trim().toLowerCase();
                var level = 0;
                if (args[2]) {
                    level = parseInt(args[2].trim());
                }
                switch (area) {
                    case 'north':
                    case 'south':
                    case 'east':
                    case 'west':
                    case 'central':
                    case 'overall':
                    client.hget("subscriptions", msg.chat.id, function(err, result) {
                        if (err) {
                            console.log('[PluginSubscribe] Error:' + err + "|" + result);
                            reply({
                                type: "text",
                                text: 'Error. ' + err
                            });
                        } else {
                            result = result ? JSON.parse(result) : {};
                            result[area] = level;
                            client.hset("subscriptions", msg.chat.id, JSON.stringify(result), function(error, result) {
                                if (error) {
                                    reply({
                                        type: "text",
                                        text: error + "|" + response
                                    });
                                } else {
                                    reply({
                                        type: "text",
                                        text: 'Subscribed to updates.'
                                    });
                                }
                            });
                        }
                    });
                    break;
                    default:
                    reply({
                        type: "text",
                        text: 'You chose an area that is not included.'
                    });
                    break;
                }
            } else {
                reply({
                    type: "text",
                    text: 'Choose an area to subscribe to (with optional threshold value). For example:\n/subscribe north 100\n/subscribe south'
                });
            }
        }
    };
}

module.exports = image;

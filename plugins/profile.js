var util = require('./../util');
var redis = require("redis"),
client = redis.createClient();

var image = function() {

    this.init = function() {
        console.log('[Plugin] profile loaded');
        client.select(3, function() { });

        client.on("error", function(err) {
            console.log("[redis] Error " + err);
        });
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["profile"]);

        if (args) {
            client.hgetall('subscriptions', function(err, results) {
                if (!err) {
                    var id = msg.chat.id;
                    if (results != null && typeof results[id] !== 'undefined') {
                        var message = 'You are subscribed to:';
                        var chatSub = JSON.parse(results[id]);

                        var area;
                        for (area in chatSub) {
                            var threshold = chatSub[area];
                            switch (area) {
                                case 'north':
                                message += '\nNorth: ' + threshold;
                                break;
                                case 'south':
                                message += '\nSouth: ' + threshold;
                                break;
                                case 'east':
                                message += '\nEast: ' + threshold;
                                break;
                                case 'west':
                                message += '\nWest: ' + threshold;
                                break;
                                case 'overall':
                                message += '\nOverall: ' + threshold;
                                break;
                            }
                        }
                        reply({
                            type: "text",
                            text: message
                        });
                    } else {
                        reply({
                            type: "text",
                            text: 'You are not subscribed to anything. Type /help to begin.'
                        });
                    }
                } else {
                    console.log(err);
                }
            });
        }
    };
}

module.exports = image;

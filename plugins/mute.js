var util = require('./../util');
var redis = require("redis"),
    client = redis.createClient();
var moment = require('moment');

var image = function() {

    this.init = function() {
        console.log('[Plugin] mute loaded');
        client.select(3, function() {});

        client.on("error", function(err) {
            console.log("[redis] Error " + err);
        });
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["mute"]);
        if (args) {
            if (args.length > 1) {
                var start = args[1].trim().toLowerCase();
                var end = args[2].trim().toLowerCase();
                if (moment(start, 'HHMM').isValid() && moment(end, 'HHMM').isValid()) {
                    client.hget("mutes", msg.chat.id, function(err, result) {
                        if (err) {
                            console.log('[PluginMute] Error:' + err + "|" + result);
                            reply({
                                type: "text",
                                text: 'Error. ' + err
                            });
                        }
                        else {
                            result = result ? JSON.parse(result) : {};
                            result['start'] = start;
                            result['end'] = end;
                            client.hset("mutes", msg.chat.id, JSON.stringify(result), function(error, result) {
                                if (error) {
                                    reply({
                                        type: "text",
                                        text: error + "|" + response
                                    });
                                }
                                else {
                                    reply({
                                        type: "text",
                                        text: 'Updates muted'
                                    });
                                }
                            });
                        }
                    });
                } else {
                    reply({
                       type: "text",
                       text: 'Wrong date format. Date should be in 24hour format. For example:\n /mute 2100 0700\nmute from 9pm to 7am.'
                    });
                }
            }
            else {
                reply({
                    type: "text",
                    text: 'Time not in correct format (24hour format).\nExample: /mute 2100 0700 (mute from 9pm to 7am)'
                });
            }
        }
        else {
            reply({
                type: "text",
                text: 'Choose an area to subscribe to (with optional threshold value). For example:\n/subscribe north 100\n/subscribe south'
            });
        }
    };
}

module.exports = image;

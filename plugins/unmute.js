var util = require('./../util');
var redis = require("redis"),
client = redis.createClient();

var image = function() {

    this.init = function() {
        console.log('[Plugin] unsubscribe loaded');
        client.select(3, function() { });

        client.on("error", function(err) {
            console.log("[redis] Error " + err);
        });

    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["unmute"]);
        if (args) {
            client.hdel("mutes", msg.chat.id, function(error, response) {
                if (!error) {
                    reply({
                        type: "text",
                        text: 'Mutes removed.'
                    });
                } else {
                    reply({
                        type: "text",
                        text: 'Unable to unmute: ' + error
                    });
                }
            });
        }
    };
}

module.exports = image;

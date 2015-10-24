var util = require('./../util');

var image = function() {

    this.init = function() {
        console.log('[Plugin] help loaded');
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["help"]);

        if (args) {
            reply({
                type: "text",
                text: 'Commands:\n/areas - show areas covered.\n/subscribe <area> <threshold> - subscribe to hourly PSI updates with threshold (to prevent spam). Threshold must be a number and is optional. Default: 0.\n/unsubscribe - unsubscribe to updates.\n/help - show this again.\n/profile - displays all your subscribed areas.\n/current - shows every area\'s PSI level.'
            });
        }
    };
}

module.exports = image;

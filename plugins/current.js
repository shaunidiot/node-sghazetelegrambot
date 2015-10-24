var util = require('./../util');

var image = function() {

    this.init = function() {
        console.log('[Plugin] current loaded');
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["current"]);

        if (args) {

        }
    };
}

module.exports = image;

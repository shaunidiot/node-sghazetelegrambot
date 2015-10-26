var util = require('./../util');

var image = function() {

    this.init = function() {
        console.log('[Plugin] areas loaded.');
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["areas", "area"]);

        if (args) {
            reply({
                type: "text",
                text: 'Areas included: \nnorth\nsouth\neast\nwest\ncentral\noverall'
            });
        }
    };
}

module.exports = image;

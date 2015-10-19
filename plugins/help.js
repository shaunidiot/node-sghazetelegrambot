/*
    DESCRIPTION: 
        Get a specific reddit post from r/frontpage

    AUTHOR: 
        Phill Farrugia

    COMMANDS:
        [reddit, !reddit, /reddit] <1-25>

    EXAMPLE:
        You: reddit 1
        Bot: r/pics - An Amazonian girl and her pet sloth 
        http://reddit.com/r/pics/comments/3hxg1e/an_amazonian_girl_and_her_pet_sloth/
*/

var request = require('request');
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
                text: 'Commands:\n/areas - show areas covered.\n/subscribe <area> - subscribe to hourly PSI updates.\n/unsubscribe - unsubscribe to updates.\n/help - show this again.'
            });
        }
    };
}

module.exports = image;

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
var haze = require('node-sghaze');
var util = require('./../util');

var image = function() {

    this.init = function() {
        console.log('haze loaded');
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["subscribe", "help", "unsubscribe", "areas"]);

        if (args) {

        }
        console.log('Haze: ' + msg.text.toLowerCase());
        if (msg.text.toLowerCase() == "haze") {
            reply({
                type: "status",
                status: "typing"
            });
            haze.retrieveData('781CF461BB6606ADBC7C75BF9D4F60DB336AE43A696D2568', function(error, data) {
                if (!error) {
                    reply({
                        type: "text",
                        text: JSON.stringify(data)
                    });
                    console.log(data);
                }
                else {
                    console.log(error);
                    reply({
                        type: "text",
                        text: "Oops! Try again later"
                    });

                }
            });
        }
    };
    n
}

module.exports = image;

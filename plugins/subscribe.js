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
var redis = require("redis"),
    client = redis.createClient();


var image = function() {

    this.init = function() {
        console.log('[Plugin] subscribe loaded');
        client.select(3, function() { /* ... */ });

        client.on("error", function(err) {
            console.log("[redis] Error " + err);
        });
    };

    this.doStop = function(done) {
        done();
    };

    this.doMessage = function(msg, reply) {
        var args = util.parseCommand(msg.text, ["subscribe"]);
        console.log('length: ' + args.length);
        console.log('chat id: ' + msg.chat.id);
        if (args && args.length > 1) {
            console.log('here');
            console.log('[Subscribe] ' + JSON.stringify(msg));
            var area = args[1].trim().toLowerCase();
            switch (area) {
                case 'north':
                case 'south':
                case 'east':
                case 'west':
                case 'overall':
                    client.hget("subscriptions", msg.chat.id, function(err, result) {
                        if (err) {
                            console.log('error:' + err + "|" + result);
                        }
                        else {
                            console.log('result: ' + result);
                        }
                        result = result ? JSON.parse(result) : {};
                        result[area] = 100;
                        console.log('here: ' + result);
                        client.hset("subscriptions", msg.chat.id, JSON.stringify(result), function(error, result) {
                            if (error) {
                                reply({
                                    type: "text",
                                    text: error + "|" + response
                                });
                            }
                            else {
                                reply({
                                    type: "text",
                                    text: 'Subscribed to updates.'
                                });
                            }
                        });
                    });
                    break;
                default:

                    reply({
                        type: "text",
                        text: 'You chose an area that is not included.'
                    });
                    break;
            }
        }
    };
}

module.exports = image;

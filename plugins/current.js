var util = require('./../util');
var fs = require('fs');
var config = require('./../config');
var haze = require('node-sghaze');
var moment = require('moment');

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
            fs.exists('./data/haze.json', function(exists) {
                if (exists) {
                    fs.readFile('./data/haze.json', 'utf8', function (err,data) {
                        if (err) {
                            return console.log(err);
                        } else {
                            var haze = JSON.parse(data);
                            var message = 'Latest PSI value:\n';
                            haze.forEach(function(element, index, array) {
                                message += '\n' + element.name + ': ' + element.value;
                            });
                            message += '\n\nAs of ' + moment(haze[1].timestamp).format("YYYY-MM-DD HH:mm");
                            reply({
                                type: "text",
                                text: message
                            });
                        }
                    });
                } else {
                    haze.retrieveDataLegacy(function(error, data) {
                        if (!error) {
                            fs.writeFile("./data/haze.json", JSON.stringify(data), function(err) {
                                if(err) {
                                    return console.log(err);
                                } else {
                                    console.log("[fetchNewHazeData] The file was saved!");
                                    var haze = data;
                                    var message = 'Latest PSI value:\n';
                                    haze.forEach(function(element, index, array) {
                                        message += '\n' + element.name + ': ' + element.value;
                                    });
                                    message += '\n\nAs of ' + moment(haze[1].timestamp).format("YYYY-MM-DD HH:mm");
                                    reply({
                                        type: "text",
                                        text: message
                                    });
                                }
                            });
                        } else {
                            console.log('[fetchNewHazeData]: ' + error);
                        }
                    });
                }
            });
        }
    };
}

module.exports = image;

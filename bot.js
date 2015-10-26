var config = require('./config');
var token = config.telegramToken;
var fs = require('fs');
var moment = require('moment');

var async = require('async');
var CronJob = require('cron').CronJob;

var PluginManager = require('./plugins');
var plugins = new PluginManager();

var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(token, {
    polling: true
});

var haze = require('node-sghaze');

var redis = require("redis"),
client = redis.createClient();

client.select(3, function() { });

client.on("error", function(err) {
    console.log("[redis] Error " + err);
});


plugins.runPlugins(config.activePlugins);

bot.getMe().then(function(me) {
    console.log('Hi my name is %s!', me.username);
});

bot.on('message', function(msg) {
    if (msg.text) {
        var chatId = msg.chat.id;
        plugins.doMessage(msg, function(reply) {
            switch (reply.type) {
                case "text":
                bot.sendMessage(chatId, reply.text);
                break;
                case "audio":
                bot.sendAudio(chatId, reply.audio);
                break;
                case "photo":
                bot.sendPhoto(chatId, reply.photo);
                break;
                case "status":
                bot.sendChatAction(chatId, reply.status);
                break;
                default:
                console.log("Error: Unrecognized response");
            }
        });
    }
});

function processSub(data, chatID, chatSub) {
    var area;
    var message = 'PSI Updates:\n';
    var overallDate = '';
    for (area in chatSub) {
        var threshold = chatSub[area];
        var value, date;
        switch (area) {
            case 'north':
            value = data[0].value;
            date = moment(data[0].timestamp).format("YYYY-MM-DD HH:mm");
            break;
            case 'south':
            value = data[5].value;
            date = moment(data[5].timestamp).format("YYYY-MM-DD HH:mm");
            break;
            case 'east':
            value = data[3].value;
            date = moment(data[3].timestamp).format("YYYY-MM-DD HH:mm");
            break;
            case 'west':
            value = data[4].value;
            date = moment(data[4].timestamp).format("YYYY-MM-DD HH:mm");
            break;
            case 'overall':
            value = data[1].value;
            date = moment(data[1].timestamp).format("YYYY-MM-DD HH:mm");
            break;
        }
        if (value >= threshold) {
            message += '\n' + area + " : " + value;
            overallDate = moment(data[1].timestamp).format("YYYY-MM-DD HH:mm");
        }
    }
    if (message.length > 0) {
        message += "\n\nAs of " + overallDate;
        bot.sendMessage(chatID, message);
    }
}

function sendNewUpdates() {
    fs.readFile('./data/haze.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        } else {
            var haze = JSON.parse(data);
            client.hgetall('subscriptions', function(err, results) {
                if (!err) {
                    var chatID;
                    for (chatID in results) {
                        var chatSub = JSON.parse(results[chatID]);
                        processSub(haze, chatID, chatSub);
                    }
                } else {
                    console.log(err);
                }
            });
        }
    });
}

function fetchNewHazeData() {
    haze.retrieveDataLegacy(function(error, data) {
        if (!error) {
            fs.writeFile("./data/haze.json", JSON.stringify(data), function(err) {
                if(err) {
                    return console.log(err);
                } else {
                    console.log("[fetchNewHazeData] The file was saved!");
                }
            });
        } else {
            console.log('[fetchNewHazeData]: ' + error);
        }
    });
}

new CronJob('*/30 * * * *', function() {
    console.log('[cron] Fetching new haze data.');
    fetchNewHazeData();
}, null, true, 'Asia/Singapore');

new CronJob('0 * * * *', function() {
    console.log('[cron] Sending updates to users.');
    sendNewUpdates();
}, null, true, 'Asia/Singapore');

//setInterval(function(){
//fetchNewHazeData();
//}, 5000);

// If `CTRL+C` is pressed we stop the bot safely.
process.on('SIGINT', shutDown);

// Stop safely in case of `uncaughtException`.
//process.on('uncaughtException', shutDown);

function shutDown() {
    console.log("The bot is shutting down...");
    plugins.shutDown(function() {
        process.exit();
    });
}

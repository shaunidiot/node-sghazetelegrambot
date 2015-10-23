var config = require('./config');
var token = config.telegramToken;

var async = require('async');

var PluginManager = require('./plugins');
var plugins = new PluginManager();

var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(token, {
    polling: true
});

var haze = require('node-sghaze');

var redis = require("redis"),
    client = redis.createClient();

client.select(3, function() { /* ... */ });

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
    for (area in chatSub) {
        var threshold = chatSub[area];
        c api = getIndex(data, area).index;
        console.log(api, threshold, area);
        if (api >= threshold) {
            bot.sendMessage(chatID, 'Hey man, it\'s getting kinda hazy at ' + area + ' the API is at ' + api);
        }
    }
}

function doCronJob() {
    haze.retrieveData('781CF461BB6606ADBC7C75BF9D4F60DB336AE43A696D2568', function(error, data) {
        if (!error) {
            redis.hgetall('subscriptions', function(err, results) {
                if (!err) {
                console.log(JSON.stringify(results));
                var chatID;
                for (chatID in results) {
                    var chatSub = JSON.parse(results[chatID]);
                    processSub(data, chatID, chatSub);
                }
                } else {
                    console.log(err);
                }
            });
        }
        else {
            console.log(error);
        }
    });
}

// If `CTRL+C` is pressed we stop the bot safely.
process.on('SIGINT', shutDown);

// Stop safely in case of `uncaughtException`.
process.on('uncaughtException', shutDown);

function shutDown() {
    console.log("The bot is shutting down...");
    plugins.shutDown(function() {
        process.exit();
    });
}
